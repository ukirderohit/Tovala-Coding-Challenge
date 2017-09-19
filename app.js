/**
 * Created by ukirderohit on 9/12/17.
 */


var tovala = angular.module('tovala', []);
var canvas = new fabric.Canvas('myCanvas');


function getRandomLeftTop() {
    var offset = 50;
    return {
        left: getRandomInt(0 + offset, 900 - offset),
        top: getRandomInt(0 + offset, 500 - offset)
    };
}

function pad(str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function getRandomColor() {
    return (
        pad(getRandomInt(0, 255).toString(16), 2) + //Letters a-z are used for digits with values 10 through 35
        pad(getRandomInt(0, 255).toString(16), 2) +
        pad(getRandomInt(0, 255).toString(16), 2)
    );
}


// select all objects
function deleteObjects() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        if (confirm('Are you sure?')) {
            canvas.remove(activeObject);
        }
    }
    else if (activeGroup) {
        if (confirm('Are you sure?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                canvas.remove(object);
            });
        }
    }
}


// select all objects
function changeColorObjects(jscolor) {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        canvas.getActiveObject().set("fill", "#" + jscolor);
        canvas.renderAll(); //getting cached by some internal fabric magic, and the cached version is being rendered instead of the updated version. To render the updated version you have to do this
    }
    else if (activeGroup) {

        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            object.set("fill", "#" + jscolor);
            canvas.renderAll();
        });
        canvas.renderAll();
    }
}


$("#delRect").click(function () {
    deleteObjects();
});

$("#colorChangeRect").click(function () {
    changeColorObjects(jscolor);
});

$("#closeall").click(function () {
    canvas.clear();
});


tovala.factory('corporateFactory', function () {

    var corpfac = {};


    corpfac.getLayout = function () {

        var savedLayout11 = JSON.parse(localStorage.getItem("layouts"));

        return savedLayout11;
    };
    corpfac.getOneLayout = function (index) {

        var savedLayout1 = JSON.parse(localStorage.getItem("layouts"));

        return savedLayout1[index];
    };
    corpfac.delLayout = function (index) {
        var savedLayout1 = JSON.parse(localStorage.getItem("layouts"));
        var ifSure = confirm("Are you sure??");
        if (ifSure) {
            savedLayout1.splice(index, 1);
            localStorage.setItem('layouts', JSON.stringify(savedLayout1));
            window.location.reload();
            canvas.clear();
        }
        //return savedLayout1;
    };


    corpfac.setLeader = function (user1, lyname, data) {
        var check = true;
        if (localStorage.getItem("layouts") == null) {

            var savedLayout = [{
                "username": user1,
                "layouts": [{"name": lyname, "layout": data}]
            }];
            localStorage.setItem("layouts", JSON.stringify(savedLayout));
            check = false;

        }
        else {
            console.log("not null");
            var savedLayout = JSON.parse(localStorage.getItem("layouts"));
            //console.log(savedLayout);
            var bkey;
            var bvalue;
            var obj = {};
            obj.name = lyname;
            obj.layout = data;
            angular.forEach(savedLayout, function (value, key) {
                if (user1 === value.username) {
                    console.log("matches");
                    check = false;
                    bkey = key;
                    bvalue = value.layouts;
                    bvalue.push(obj);
                    localStorage.setItem("layouts", JSON.stringify(savedLayout));
                    //console.log(savedLayout);

                }
            });


        }

        if (check) {

            //console.log("not matches");
            var savedLayout1 = corpfac.getLayout();
            //console.log(savedLayout1);
            var a = {
                "username": user1,
                "layouts": [{"name": lyname, "layout": data}]
            };
            savedLayout1.push(a);
            localStorage.setItem("layouts", JSON.stringify(savedLayout1));

        }

    };
    return corpfac;

});


function cleanstore() {
    localStorage.clear();
}


tovala.controller('TovalaController', ['$scope', 'corporateFactory', function TovalaController($scope, corporateFactory) {

    $scope.addRect = function (e) {
        var coord = getRandomLeftTop();

        canvas.add(new fabric.Rect({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            width: 50,
            height: 50,
            opacity: 0.8
        }));
    };

    $scope.savedLayouts = corporateFactory.getLayout();
    $scope.Lname;
    $scope.loadLayout = function (indexLayoutName) {
        console.log(indexLayoutName);
        for (i = 0; i < $scope.Lname.length; i++) {

            if ($scope.Lname[i].name == indexLayoutName) {
                console.log($scope.Lname[i].layout);
                console.log($scope.Lname[i].name);
                canvas.loadFromJSON($scope.Lname[i].layout, canvas.renderAll.bind(canvas), function (o, object) {
                    fabric.log(o, object);
                });
            }

        }

    };

    $scope.loadLayouts1 = function (indexUsername) {
        // console.log(index);

        $scope.savedLayout = corporateFactory.getLayout();
        for (i = 0; i < $scope.savedLayout.length; i++) {

            if ($scope.savedLayout[i].username == indexUsername) {
                console.log('yes');
                $scope.Lname = $scope.savedLayout[i].layouts;
            }

        }
        //console.log($scope.Lname);

    };


    $scope.deleteLayout = function (indexLayoutName1, indexUser) {
        console.log(indexLayoutName1);
        console.log(indexUser);
        $scope.savedLayout1 = corporateFactory.getLayout();
        for (i = 0; i < $scope.savedLayout1.length; i++) {

            if ($scope.savedLayout1[i].username == indexUser) {


                for (j = 0; j < $scope.savedLayout1[i].layouts.length; j++) {

                    if ($scope.savedLayout1[i].layouts[j].name == indexLayoutName1) {
                        var ifSure = confirm("Are you sure??");
                        if (ifSure) {
                            $scope.savedLayout1[i].layouts.splice(j, 1);  //[j].layouts
                            localStorage.setItem('layouts', JSON.stringify($scope.savedLayout1));
                            window.location.reload();
                            canvas.clear();
                        }
                    }

                }


            }

        }


    };

    $scope.saveJSON = function () {
        var userName = prompt("Enter username");
        var userLayoutName = prompt("Enter Layout Name to Save::");
        corporateFactory.setLeader(userName, userLayoutName, canvas);
        console.log(corporateFactory.getLayout());
        confirm("Layout Saved Succesfully");
        window.location.reload();

    };

}]);

