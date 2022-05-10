var  segTreeSize = [0, 11];
var  searchSpace = [0, 11];
var  selected_node = -1;
var  mouse_button_down = false;
var  start_sum = false;
var segTree;
var result = 0;

function setup() {
  createCanvas(1000, 600);
  segTree = new SegmentTree(...segTreeSize);
  let values = [];
  for (let i = 0; i <= segTreeSize[1]-segTreeSize[0]; i++)
    {
      values[i] = 0;
    }
  segTree.build(values);
  frameRate(3);
}

function draw_global_result()
{
  push();
  fill(255);
  textSize(28);
  text("Sum in range [" + searchSpace[0] + ", " + searchSpace[1] + "] : "+result, 0, 28);
  pop();
}

function draw_global_lines()
{
  for (let i = 0; i <= segTreeSize[1]-segTreeSize[0]+1; i++)
    {
      let x = (width*0.9) / (segTreeSize[1]-segTreeSize[0]);
      push();
      stroke("#607d8b");
      line(width*0.05 + i* x - x/2, 0, width*0.05 + i* x - x/2, height);
      pop();
    }
}

function draw() {
  if (mouse_button_down && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    selected_node = -1;
  if (selected_node != -1)
  {
    $('#selected_node_value').val( segTree.tree[selected_node]);
  }
  background("#263238");
  draw_global_lines();
  segTree.draw();
  // segTree.clear_use();
  if (start_sum)
  {
    start_sum = false;
    result = segTree.sum(...searchSpace);
  }
  draw_global_result();
  mouse_button_down = false;
}

function mouseClicked() {
  mouse_button_down = true;
}
