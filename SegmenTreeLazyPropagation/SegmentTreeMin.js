class SegmentTree {
//   constructor(left, right) {
//     this.left = left;
//     this.right = right - 1;
// 	this.size = 0;
//     this.tree = Array((right - left)*4);
//     this.used = Array((right - left)*4);
//     this.lazy = Array((right - left)*4);
//     for (let i = 0; i < (right-left)*4; i++)
//     {
//       this.tree[i] = 0;
//       this.used[i] = 0;
//       this.lazy[i] = 0;
//     }
//   }
  
constructor(n){
	  this.NeutralElement = Number.MAX_VALUE;
	  this.size = 1;
	  while(this.size < n) this.size *= 2;
    this.left = 0;
	  this.right = this.size - 1;
	  this.tree = Array(this.size * 2);
	  this.used = Array(this.size * 2);
	  this.lazy = Array(this.size * 2);
	  for (let i = 0; i < this.tree.length; i++)
		{
      this.tree[i] = this.NeutralElement;
      this.used[i] = 0;
      this.lazy[i] = this.NeutralElement;
		}
  }
  
  resize(n){
    this.size = 1;
	  while(this.size < n) this.size *= 2;
    this.left = 0;
	  this.right = this.size - 1;
	  this.tree = Array(this.size * 2);
	  this.used = Array(this.size * 2);
	  this.lazy = Array(this.size * 2);
	  for (let i = 0; i < this.tree.length; i++)
		{
      this.tree[i] = this.NeutralElement;
      this.used[i] = 0;
      this.lazy[i] = this.NeutralElement;
		}
  }

  clear_use(){
    for (let i = 0; i < this.tree.length; i++)
    {
      // this.tree[i] = 0;
      this.used[i] = 0;
      // this.lazy[i] = this.NeutralElement;
    } 
  }

  propagation(root, lx, rx){
    if(rx - lx === 1 || this.lazy[root] === this.NeutralElement)
      return;
    
    this.tree[root * 2 + 1] = this.lazy[root];
    this.tree[root * 2 + 2] = this.lazy[root];

    this.lazy[root * 2 + 1] = this.lazy[root];
    this.lazy[root * 2 + 2] = this.lazy[root];
    
    this.lazy[root] = this.NeutralElement;
  }

  set_recursive(l, r, val, root, lx, rx){
    if(l >= rx || r <= lx)
      return;

    console.log("inside recursive set function", l, r, val);
    this.used[root] = 2;
    if(l <= lx && rx <= r){
      // this.ApplyOperation(this.lazy[root], val); can't do this because javascript don't have pass by reference
      this.lazy[root] = val;
      // this.ApplyOperation(this.tree[root], val*(rx - lx));
      this.tree[root] = val;
      
      return;
    }

    this.propagation(root, lx, rx);

    let m = Math.floor((lx + rx) / 2);
    this.set_recursive(l, r, val, root * 2 + 1, lx, m);
    this.set_recursive(l, r, val, root * 2 + 2, m, rx);

    this.tree[root] = Math.min(this.tree[root * 2 + 1], this.tree[root * 2 + 2]);
    
    return;
  }

  set(l, r, val){
    // console.log(l, r, val); 
    this.set_recursive(l, r, val, 0, 0, this.size);
  }

  calculate_sum_recursive(l, r, val, lx, rx, root){
    if(l >= rx || r <= lx)
      return this.NeutralElement;

    this.used[root] = 2;
    if(l <= lx && rx <= r){
      this.used[root] = 1;
      return this.tree[root];
    }

    // val += this.lazy[root];
    // console.log(l, r, val, lx, rx, root);
    this.propagation(root, lx, rx);
    let mid = Math.floor((lx + rx) / 2);
    let res1 = this.calculate_sum_recursive(l, r, val, lx, mid, root * 2 + 1);
    let res2 = this.calculate_sum_recursive(l, r, val, mid, rx, root * 2 + 2);

    return Math.min(res1, res2);

  }

  calculate_sum(l, r){
    return this.calculate_sum_recursive(l, r, 0, 0, this.size, 0);
  }

  build_recursive(arr, lx, rx, root){
    if(rx - lx == 1){
      if(lx < arr.length)
      {
        console.log(lx, rx, arr[lx])
        this.tree[root] = arr[lx];
      }
      return;
    }
    let mid = (lx + rx) / 2;
    this.build_recursive(arr, lx, mid, root * 2 + 1);
    this.build_recursive(arr, mid, rx, root * 2 + 2);
    this.tree[root] = Math.min(this.tree[root * 2 + 1], this.tree[root * 2 + 2]);
  }

  build_arr(arr){
    this.build_recursive(arr, 0, this.size , 0);
  }

  draw_subtree(index, left, right, depth) {
    let w, x, y;

    y = map(depth, 0, Math.ceil(Math.log2(this.right-this.left+1)), 0, height)*0.9+height*0.05;
    x = map((left + right) / 2, this.left, this.right, 0, width) * 0.9 + width * 0.05;
    w = map(right-left+1, this.left, this.right, 0, width*0.9);
    
    if (right==left && mouse_button_down)
      {
        if (dist(x, y, mouseX, mouseY) < 35)
          selected_node = index;
      }
    
    let mid = Math.floor((right + left) / 2);
    if (right != left)
    {
      const [x1, y1] = this.draw_subtree(index * 2 + 1, left, mid, depth + 1);
      push();
      if (this.used[index*2+1])
        stroke("#4caf50");
      else
        stroke(150);
      line(x, y, x1, y1);
      pop();
      const [x2, y2] = this.draw_subtree(index * 2 + 2, mid + 1, right, depth + 1);
      push();
      if (this.used[index*2+2])
        stroke("#4caf50");
      else
        stroke(150);
      line(x, y, x2, y2);
      pop();
    }
    push();
    if (selected_node == index)
    {
      stroke(0, 0, 255);
      strokeWeight(2);
    }
    else
    {
      stroke("#4caf50");
      strokeWeight(0.5);
      noStroke();
    }
    if (this.used[index] == 1)
    {
      fill("#4caf50");
      rect(x-w/2, y, w , 10);
    }
    else if (this.used[index] == 2)
    {
      fill("#795548");
    }
    else
      fill("#f44336");
    ellipse(x, y, 35, 35);
    fill(255);
    textAlign(CENTER, CENTER);
    text("[" + left + ", " + right + "]", x, y-25);
    
    if(this.lazy[index] === this.NeutralElement)
      text("(inf)", x+25, y+15);
    else
      text("("+this.lazy[index]+")", x+25, y+15);
    fill(255);
    textSize(21);

    if(this.tree[index] === this.NeutralElement)
      text("inf", x, y);
    else
      text(""+this.tree[index]+"", x, y);
    pop();
    return [x, y];
  }
  draw() {
    this.draw_subtree(0, this.left, this.right, 0);
  }
}