/**
* Camera controller
* @class CameraController
* @constructor
* @param {String} object to configure from
*/

function CameraController(o)
{
	this.speed = 10;
	this.rot_speed = 1;
	this.wheel_speed = 1;
	this.smooth = false;
	this.cam_type = "orbit"; //"fps"
	this._moving = vec3.fromValues(0,0,0);
	this.orbit_center = null;

	this.configure(o);
}

CameraController.icon = "mini-icon-cameracontroller.png";

CameraController.prototype.onAddedToNode = function(node)
{
	LEvent.bind(node,"mousemove",this.onMouse,this);
	LEvent.bind(node,"mousewheel",this.onMouse,this);
	LEvent.bind(node,"keydown",this.onKey,this);
	LEvent.bind(node,"keyup",this.onKey,this);
	LEvent.bind(node,"update",this.onUpdate,this);
}

CameraController.prototype.onUpdate = function(e)
{
	if(!this._root) return;

	if(this._root.transform)
	{
	}
	else if(this._root.camera)
	{
		var cam = this._root.camera;
		if(this.cam_type == "fps")
		{
			//move using the delta vector
			if(this._moving[0] != 0 || this._moving[1] != 0 || this._moving[2] != 0)
			{
				var delta = cam.getLocalVector( this._moving );
				vec3.scale(delta, delta, this.speed * (this._move_fast?10:1));
				cam.move(delta);
				cam.updateMatrices();
			}
		}
	}

	if(this.smooth)
	{
		Scene.refresh();
	}
}

CameraController.prototype.onMouse = function(e, mouse_event)
{
	if(!this._root) return;
	
	var cam = this._root.camera;
	if(!cam) return;

	if(mouse_event.eventType == "mousewheel")
	{
		cam.orbitDistanceFactor(1 + mouse_event.wheel * -0.001 * this.wheel_speed, this.orbit_center);
		cam.updateMatrices();
		return;
	}

	//regular mouse dragging
	if(!mouse_event.dragging)
		return;

	if(this._root.transform)
	{
	}
	else 
	{
		if(this.cam_type == "fps")
		{
			cam.rotate(-mouse_event.deltax * this.rot_speed,[0,1,0]);
			cam.updateMatrices();
			var right = cam.getLocalVector([1,0,0]);
			cam.rotate(-mouse_event.deltay * this.rot_speed,right);
			cam.updateMatrices();
		}
		else if(this.cam_type == "orbit")
		{
			if(mouse_event.ctrlKey) //pan
			{
				var delta = cam.getLocalVector( [ this.speed * -mouse_event.deltax * 0.1, this.speed * mouse_event.deltay * 0.1, 0]);
				cam.move(delta);
				cam.updateMatrices();
			}
			else
			{
				cam.orbit(-mouse_event.deltax * this.rot_speed,[0,1,0], this.orbit_center);
				//if(e.shiftKey)
				//{
					cam.updateMatrices();
					var right = cam.getLocalVector([1,0,0]);
					cam.orbit(-mouse_event.deltay * this.rot_speed,right, this.orbit_center);
				/*
				}
				else
				{
					cam.orbitDistanceFactor(1 + mouse_event.deltay * 0.01, this.orbit_center);
					cam.updateMatrices();
				}
				*/
			}
		}
	}
}

CameraController.prototype.onKey = function(e, key_event)
{
	if(!this._root) return;
	//trace(key_event);
	if(key_event.keyCode == 87)
	{
		if(key_event.type == "keydown")
			this._moving[2] = -1;
		else
			this._moving[2] = 0;
	}
	else if(key_event.keyCode == 83)
	{
		if(key_event.type == "keydown")
			this._moving[2] = 1;
		else
			this._moving[2] = 0;
	}
	else if(key_event.keyCode == 65)
	{
		if(key_event.type == "keydown")
			this._moving[0] = -1;
		else
			this._moving[0] = 0;
	}
	else if(key_event.keyCode == 68)
	{
		if(key_event.type == "keydown")
			this._moving[0] = 1;
		else
			this._moving[0] = 0;
	}
	else if(key_event.keyCode == 16) //shift in windows chrome
	{
		if(key_event.type == "keydown")
			this._move_fast = true;
		else
			this._move_fast = false;
	}

	//if(e.shiftKey) vec3.scale(this._moving,10);


	//LEvent.trigger(Scene,"change");
}

LS.registerComponent(CameraController);