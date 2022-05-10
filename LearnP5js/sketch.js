var bg_color = 250;
var stuff = 10, size = 10;
var Input_element, Create_tree_with_size;
var arr = [];
var  selected_node = -1;
var  mouse_button_down = false;
var segTree;
var result;
// let width = 1000;
// let height = 600;
let searchSpace = [0, size];
let slider;

function setup() {
    
    createCanvas(1000, 600);
    
    // Create Segment Tree
    segTree = new SegmentTree(size);
    searchSpace = [0, size - 1]

    //slider 
    $(document).ready(function() {
        $("#slider-range").slider({
          min: 0,
          max: size - 1,
          range: true,
          values: [0, size],
          slide: function(event, ui) {
            segTree.clear_use();
            searchSpace = ui.values;
          }
        });
    });
    
    Input_element = select("#input_value");
    Create_tree_with_size = select("#Create_with_size");

    Create_tree_with_size.mousePressed(resetTreeSize);
    Input_element.input(typing);

}

function resetTreeSize(){
    stuff = parseInt(Input_element.value());
    if(typeof stuff === "number")
        size = (stuff);
    console.log(typeof stuff , size)
    setup()
}

function typing(){
    stuff= this.value();
}

function dosomething(){
    stuff = Input_element.value()
    arr = stuff.split(",").map(Number)
    console.log(arr);
}

// function mousePressed(){
// }

function draw_global_result()
{
  push();
  fill(255);
  textSize(28);
  text("Range [" + searchSpace[0] + ", " + searchSpace[1] + "] ", 0, 20);
  pop();
}

function draw_global_lines()
{
  for (let i = 0; i <= size + 1; i++)
    {
      let x = (width*0.9) / (size - 1);
      push();
      stroke("#607d8b");
      line(width*0.05 + i* x - x/2, 0, width*0.05 + i* x - x/2, height);
      pop();
    }
}


function draw() {
    
    background("#263238");
    draw_global_lines();
    segTree.draw();
    // segTree.clear_use();
    
    draw_global_result();
    // mouse_button_down = false;
    // $(#slider-range).show()
}