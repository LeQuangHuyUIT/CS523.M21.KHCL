class SegmentTree {
    constructor(left, right) {
      this.left = left;
      this.right = right;
      this.tree = Array((right - left)*4);
      this.used = Array((right - left)*4);
      this.lazy = Array((right - left)*4);
      for (let i = 0; i < (right-left)*4; i++)
      {
        this.tree[i] = 0;
        this.used[i] = 0;
        this.lazy[i] = 0;
      }
    }
    
    get_lazy(index, left, right)
    {
      if (this.lazy[index] != 0)
      {
        this.tree[index] += this.lazy[index] * (right-left+1);
        if (left != right)
        {
          this.lazy[index*2+1] += this.lazy[index];
          this.lazy[index*2+2] += this.lazy[index];
        }
        this.lazy[index] = 0;
      }
    }
    
  recursive_range_update(find_left, find_right, left, right, index, value)
    {
      let mid = Math.floor((left+right)/2);
  
      if (find_left > right || find_right < left)
        return (0);
      if (left >= find_left && right <= find_right)
      {
        this.tree[index] += value * (right-left+1);
        if (left != right)
        {
          this.lazy[index*2+1] += value;
          this.lazy[index*2+2] += value;
        }
        return (this.tree[index]);
      }
      if (left != right)
      {
        this.recursive_range_update(find_left, find_right, left, mid, index*2+1, value);
        this.recursive_range_update(find_left, find_right, mid+1, right, index*2+2, value);
        this.tree[index] = this.tree[index*2+1] + this.tree[index*2+2];
      }
      return (0);
    }
  
    range_update(left, right, value)
    {
      let result = this.recursive_range_update(left, right, this.left, this.right, 0, value);
      return (result);
    }
    
    recursive_update(key, left, right, index, value)
    {
      let mid = Math.floor((left+right)/2);
  
      if (index == key)
      {
        this.tree[index] = value;
        return (this.tree[index]);
      }
      if (left != right)
      {
        this.tree[index] = this.recursive_update(key, left, mid, index*2+1, value) + this.recursive_update(key, mid+1, right, index*2+2, value);
      }
      return (this.tree[index]);
    }
    
      update(key, value)
    {
      this.recursive_update(key, this.left, this.right, 0, value);
    }
    
    recursive_build(values, left, right, index)
    {
      let mid = Math.floor((left+right)/2);
      if (left==right)
      {
        this.tree[index] = values[left - this.left];
        return ;
      }
      this.recursive_build(values, left, mid, index*2+1);
      this.recursive_build(values, mid+1, right, index*2+2);
      this.tree[index] = this.tree[index*2+1] + this.tree[index*2+2];
    }
  
    build(values)
    {
      this.recursive_build(values, this.left, this.right, 0);
    }
    
    recursive_sum(find_left, find_right, left, right, index)
    {
      this.get_lazy(index, left, right);
      let mid = Math.floor((left+right)/2);
  
      if (find_left > right || find_right < left)
        return (0);
      if (left >= find_left && right <= find_right)
      {
        this.used[index] = 1;
        return (this.tree[index]);
      }
      if (left != right)
      {
        if (this.used[index] == 0)
        {
          this.used[index] = 2;
          start_sum = true;
          return (0);
        }
        return (this.recursive_sum(find_left, find_right, left, mid, index*2+1) + this.recursive_sum(find_left, find_right, mid+1, right, index*2+2));
      }
      return (0);
    }
  
    sum(left, right)
    {
      let result = this.recursive_sum(left, right, this.left, this.right, 0);
      return (result);
    }
    
    clear_use()
    {
      for (let i = 0; i < (this.right-this.left)*4; i++)
      {
        this.used[i] = false;
      }
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
        rect(x-w/2, y, w, 10);
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
      text("+("+this.lazy[index]+")", x+25, y+15);
      fill(255);
      textSize(21);
      text(""+this.tree[index]+"", x, y);
      pop();
      return [x, y];
    }
    draw() {
      this.draw_subtree(0, this.left, this.right, 0);
    }
  }