export function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
    var path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
}

const config = {
    width: 1920,
    height: 1080, //默认画板高、宽
}


export function setZoom(div, canvas) {
    // console.log("div", div)
    // console.log("canvas", canvas)
    let zoom = 1;
    let divWidth = div.clientWidth,
        divHeight = div.clientHeight,
        canvasWidth = canvas.width,
        canvasHeight = canvas.height;
    // console.log("div",)
    let height = divHeight > canvasHeight ? divHeight : canvasHeight;
    let width = divWidth > canvasWidth ? divWidth : canvasWidth;
    if (width > height) {
        width = divWidth;
        height = divHeight;
        zoom = width / config.width;
    } else {
        height = height * divHeight / config.height * 0.8;
        zoom = height / config.height;
    }
    canvas.setZoom(zoom)
    canvas.setWidth(width)
    canvas.setHeight(height)
    canvas.renderAll()
    window.zoom = zoom;
}