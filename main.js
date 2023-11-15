var canvas
var fetchData = async () =>{
    //var response = await fetch("./24273-clean.json")
    var response = await fetch("./dsmenu/24273-clean.json")
    // var response = await fetch("./dsmenu/24134-clean.json")
    // var response = await fetch("./dsmenu/24056-clean.json")
    // var response = await fetch("./dsmenu/24011-clean.json")
    return await response.json()
}
var createImageObject = async (obj) => {
    return new Promise(function(resolve, reject) {
        if(!obj.src.startsWith("http")) {
            obj.src = "https://www.dsmenu.com" +  obj.src
        }
        fabric.Image.fromURL(obj.src, (oImg) => {
            oImg.set('scaleX', obj.scaleX)
            oImg.set('scaleY', obj.scaleY)
            oImg.set('left', obj.left)
            oImg.set('top', obj.top)
            oImg.set('angle', obj.angle)
            oImg.set('opacity', obj.opacity)
            oImg.set('flipX', obj.flipX)
            oImg.set('flipY', obj.flipY)
            oImg.set('originX', obj.originX)
            oImg.set('originY', obj.originY)

            if(obj.originX == 'center' && obj.originY == 'center') {
                oImg.set('width', obj.width)
                oImg.set('height', obj.height)
            } else {
                oImg.scaleToHeight(obj.height, true)
                oImg.scaleToWidth(obj.width, true)
            }
            resolve(oImg)
        });
    });
}

var createCircleObject = (obj) => {
    var item = new fabric.Circle(obj);
    return item
}
var createLineObject = (obj) => {
    var item = new fabric.Line([obj.x1, obj.y1, obj.x2, obj.y2], obj);
    return item
}
var createRectObject = (obj) => {
    var item = new fabric.Rect(obj);
    return item
}
var createTextObject = (obj) => {
    var item = new fabric.Text(obj.text, obj);
    return item
}
var getPathText = (pathList) => {
    return pathList.map(o=>o.join(' ')).join(' ')
}
var createPathGroupObject = (obj) => {
    var paths = obj.paths.map(p=>{
        if(p.path) {
            var path = new fabric.Path(getPathText(p.path))
            path.set(p)
            return path
        } else {
            return null
        }
    }).filter(o=>o != null)
    var item = new fabric.Group(paths);
    item.set(obj)
    return item
}
var createGroupObject = (obj) => {
    var items = obj.objects.map((p)=>{
        return renderObject2(p)
    }).filter(o=>o != null)
    var item = new fabric.Group(items);
    item.set(obj)
    return item
}

var renderObject = async (obj) => {
    switch(obj.type) {
        case 'image':
            {
                item = await createImageObject(obj)
                canvas.add(item);
            }
            break;
        case 'line':
            {
                item = createLineObject(obj)
                canvas.add(item);
            }
            break;
        case 'rect':
            {
                item = createRectObject(obj)
                canvas.add(item);
            }
            break;
        case 'circle':
            {
                item = createCircleObject(obj)
                canvas.add(item);
            }
            break;
        case 'path-group':
            {
                item = createPathGroupObject(obj)
                canvas.add(item);
            }
            break;
        case 'text':
            {
                item = createTextObject(obj)
                canvas.add(item);
            }
            break;
        case 'group':
            {
                item = createGroupObject(obj)
                canvas.add(item);
            }
            break;
    }
}

var renderObject2 = (obj) => {
    switch(obj.type) {
        case 'line':
            {
                return createLineObject(obj)
            }
            break;
        case 'rect':
            {
                return createRectObject(obj)
            }
            break;
        case 'circle':
            {
                return createCircleObject(obj)
            }
            break;
        case 'path-group':
            {
                return createPathGroupObject(obj)
            }
            break;
        case 'text':
            {
                return createTextObject(obj)
            }
            break;
        case 'group':
            {
                return createGroupObject(obj)
            }
            break;
    }

    return null;
}

var initializa = async()=>{
    var data = await fetchData()
    console.log("data", data)

    canvas = new fabric.Canvas('canvas', {
        top : 0,
        left : 0,
        width : 1000, //Number(data.canvas_w),
        height : 562, //Number(data.canvas_h),
        backgroundColor : data.img_path
    });

    data.canvas.objects.map((obj)=>{
        renderObject(obj)
    })
}

initializa()