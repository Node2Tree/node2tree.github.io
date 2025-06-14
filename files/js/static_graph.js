const data = JSON.parse(document.getElementById("graph-data").textContent);
const width = 1200;
const height = 1000;
function yScale(year){
  const min = -700, max = 300;
  return (year - min) / (max - min) * (height - 200) + 100;
}
let counters = {early:0,middle:0,late:0};
for(const d of data.nodes){
  if(d.year <= -430){
    d.x = 200 + (counters.early % 3) * 150;
    counters.early++;
  }else if(d.year <= -384){
    d.x = 600 + (counters.middle % 2) * 150;
    counters.middle++;
  }else{
    d.x = 900 + (counters.late % 2) * 150;
    counters.late++;
  }
  d.y = yScale(d.year);
}
const svg = document.getElementById("graph-svg");
svg.setAttribute("width", width);
svg.setAttribute("height", height);
for(const link of data.links){
  const source = data.nodes.find(n => n.id === link.source);
  const target = data.nodes.find(n => n.id === link.target);
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", source.x);
  line.setAttribute("y1", source.y);
  line.setAttribute("x2", target.x);
  line.setAttribute("y2", target.y);
  line.setAttribute("stroke", "#aaa");
  line.setAttribute("stroke-width", "3");
  svg.appendChild(line);
}
for(const node of data.nodes){
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", node.x);
  circle.setAttribute("cy", node.y);
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", "#69b3a2");
  g.appendChild(circle);
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", node.x);
  text.setAttribute("y", node.y - 30);
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "middle");
  text.textContent = node.label;
  g.appendChild(text);
  g.addEventListener("click", (event)=>{
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "block";
    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
    tooltip.innerHTML = `<strong>${node.label}</strong><br>年份: ${node.year}<br><a href="https://en.wikipedia.org/wiki/${node.id}" target="_blank">维基百科页面</a>`;
  });
  svg.appendChild(g);
}
document.addEventListener("click", (e)=>{
  if(e.target.closest("svg") === svg) return;
  document.getElementById("tooltip").style.display = "none";
});
