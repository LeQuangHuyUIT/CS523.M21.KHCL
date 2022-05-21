var bg_color = 250;
var stuff = 10, size = 8;
var Input_element, Create_tree_with_size, Create_with_arr;
var arr = [];
var  selected_node = -1;
var  mouse_button_down = false;
var segTree;
var result, show_calculated_sum = 0;
var range_update;
// let width = 1000;
// let height = 600;
let searchSpace = [0, size - 1];
let slider;

function init(){
	searchSpace = [0, segTree.size - 1]
	//slider 
    $(document).ready(function() {
        $("#slider-range").slider({
          min: 0,
          max: segTree.size - 1,
          range: true,
          values: [0, segTree.size],
          slide: function(event, ui) {
            segTree.clear_use();
            result = NaN;
            searchSpace = ui.values;
          }
        });
    });
}

function setup() {
    
    let cv = createCanvas(1000, 620);
    cv.position(width/2 - 71, 100);
    // Create Segment Tree
    segTree = new SegmentTree(size);
	  init();
    drawTable();
    
    Input_element = select("#input_value");
    Create_tree_with_size = select("#Create_with_size");
    Create_with_arr = select("#Create_with_array");
    Calculate = select("#calculate_sum");
    range_update = select("#range_update");


    Create_tree_with_size.mousePressed(resetTreeSize);
    Input_element.input(typing);

    Create_with_arr.mousePressed(Create_Tree_With_Arr);
    Input_element.input(typing);

    range_update.mousePressed(UpdateRange);
    Input_element.input(typing);

    Calculate.mousePressed(Calculate_range);
    frameRate()
}

function Calculate_range(){
  result = segTree.calculate_sum(searchSpace[0], searchSpace[1] + 1);
  show_calculated_sum = 1;
  drawTable();
}

function Create_Tree_With_Arr(){
//   stuff = Input_element.value();
	stuff = Input_element.value()
	arr = stuff.split(",").map(Number);
	size = arr.length;

	console.log(arr);
	segTree = new SegmentTree(size);
  	segTree.build_arr(arr);
  result = NaN;
	init();
  drawTable();
	// setup();
}

function UpdateRange(){
  let val = parseInt(Input_element.value());
  if (isNaN(val))
    stuff = 0;
  else 
    stuff = val;
  console.log(stuff)
  segTree.set(searchSpace[0], searchSpace[1] + 1, stuff);
  console.log(searchSpace[0], searchSpace[1], stuff, segTree.tree);
  // init();
  result = NaN;
  drawTable();
}

function resetTreeSize(){
	  // temp = Input_element.value()
    stuff = parseInt(Input_element.value());
    if(typeof stuff === "number")
        size = (stuff);

    segTree.resize(size);
    init();
    result = NaN;
    drawTable();
}

function typing(){
    stuff= this.value();
	// console.log("typing", stuff)
}


// function mousePressed(){
// }

function draw_global_result()
{
  push();
  fill(255);
  textSize(28);
  let val = result;
  if(result === segTree.NeutralElement)
    val = "oo";
  if(!isNaN(result))
    text("Min in Range [" + searchSpace[0] + ", " + searchSpace[1] + "]: " + val, 0, 20);
  else
    text("Range [" + searchSpace[0] + ", " + searchSpace[1] + "] ", 0, 20);
  pop();
  show_calculated_sum = 1;
}

function draw_global_lines()
{
	let real_size = segTree.size;
  for (let i = 0; i <= real_size + 1; i++)
    {
      let x = (width*0.9) / (real_size - 1);
      push();
      stroke("#607d8b");
      line(width*0.05 + i* x - x/2, 0, width*0.05 + i* x - x/2, height);
      pop();
    }
}

function drawTable(){
  var table = document.getElementById("myTable");
  var tableRows = table.getElementsByTagName('tr');
  var rowCount = table.rows.length;
  console.log("delete table");
  for (var x=rowCount-1; x>0; x--) {
    table.deleteRow(x);
  }

  for(let i = 0; i < segTree.tree.length; i++){
    var row = table.insertRow(i + 1);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    // Add some text to the new cells:
    cell1.innerHTML = i;

    var val1 = segTree.tree[i];
    if(segTree.tree[i] === segTree.NeutralElement)
      val1 = "oo";

    var val2 = segTree.lazy[i];
    if(val2 === segTree.NeutralElement)
      val2 = "oo";

    cell2.innerHTML = val1; 
    cell3.innerHTML = val2; 
  }
  // var newTale = new p5.Table(segTree.tree)  

}

function mouseClicked(){
  show_calculated_sum = 1;
  show_calculated_sum %= 2;
}

function draw() {
    
    background("#263238");
    draw_global_lines();
    // console.log("draw")
    segTree.draw();
    // segTree.clear_use();
    draw_global_result();
    // mouse_button_down = false;
    // $(#slider-range).show()
}