function route(handle, pathname){
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function'){
        handle[pathname]();
    }
    else {
        console.log("No Request handler found for " + pathname);
    }
}

exports.route = route;