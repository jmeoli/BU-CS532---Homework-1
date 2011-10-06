
/* General Constants */
var TWO_PI = ( 2 * Math.PI );


/* BODY */

function Body ( x, y, scale, frameOffset )
{
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.frameOffset = frameOffset;
	
	
	/* Draw this body at the given frame of animation */
	
	this.draw = function ( frame, context )
	{	context.save();
		
		/* Adjust Frame */
		frame += this.frameOffset;
		 
		/* Calculate Arm/Leg Angles */
		/* Arm and leg animation is broken into two sections
			(1) Arms going up / legs going out
			(2) Arms coming down / legs going in
			
			'frame2' represents the frame number in terms of the current animation cycle 
		*/
		var section = Math.floor( frame / Body.framesPerSection );
		var frame2 = ( frame % Body.framesPerSection );
		if ( section % 2 == 1 )		// Section (2)
			frame2 = ( Body.framesPerSection - frame2 );
			
		/* The starting position (frame2 == 0) is arms down and legs in */
		var armAngle = ( Body.armStartAngle + ( Body.armAngleInc * frame2 ) );
		var legAngle = ( Body.legStartAngle + ( Body.legAngleInc * frame2 ) );
		
		/* Calculate vertical adjustment */
		/* Jumping animation is broken into four sections
			(1) The initial jump
			(2) Landing with legs out
			(3) Jumping from position (2)
			(4) Landing back in the start position with legs in
			
			'frame2' represents the frame number in terms of the current animation cycle
		*/
		var x = this.x;
		var y = this.y;
		
		frame2 = ( frame % Body.framesPerSection2 );
		if ( frame2 < 5 )		// Section (1)
			y -= frame2;
		else if ( frame2 < 10 )	// Section (2)
			y += ( ( frame2 - 5 ) * 2 - 5 );
		else if ( frame2 < 15 )	// Section (3)
			y -= ( ( frame2 - 10 ) * 2 - 5 );
		else					// Section (4)
			y += ( frame2 - 20 );
	
		/* Translate to the body's coordinate space */
		context.translate( x, y );
		
		/* Scale */
		if ( this.scale != 1 )
			context.scale( this.scale, this.scale );
		
		/* Actually draw the body */
		Body.drawBody( armAngle, legAngle, context );
		
		context.restore();
	};
}


/* Body Animation Constants */
Body.framesPerSection = 10;
Body.framesPerSection2 = ( Body.framesPerSection + Body.framesPerSection );
Body.armStartAngle = ( Math.PI * 1.45 );
Body.armAngleInc = ( Math.PI / 10.0 );
Body.legStartAngle = ( Math.PI * 1.5 );
Body.legAngleInc = ( Math.PI / 50.0 );

/* Body Constants */
Body.thickness = 6;
Body.halfThickness = ( Body.thickness / 2 );
Body.headRadius = 15;
Body.torsoLen = 40;
Body.armLen = 35;
Body.legLen = 50;
Body.neckLen = 10;
Body.shoulderLen = 32;
Body.halfShoulderLen = ( Body.shoulderLen / 2 );
Body.hipsLen = 20;
Body.halfHipsLen = ( Body.hipsLen / 2 );
Body.shoulderY = ( Body.neckLen + Body.halfThickness );
Body.hipsY = ( Body.neckLen + Body.torsoLen - Body.thickness );

/* Does the work of drawing a body with the given arm and leg angles */

Body.drawBody = function ( armAngle, legAngle, context )
{	/* Line Settings */
	context.lineCap = "round";
	context.lineWidth = Body.thickness;
		
	/* Head */
	context.beginPath();
	context.lineWidth = Body.thickness;
	context.arc( 0, -Body.headRadius, Body.headRadius, 0, TWO_PI );
	context.stroke();
	
	/* Neck */
	context.fillRect( -Body.halfThickness, 0, Body.thickness, Body.neckLen );
	
	/* Torso */
	context.fillRect( -Body.halfThickness, Body.shoulderY-Body.halfThickness, Body.thickness, Body.torsoLen );
	
	/* Shoulders */
	context.beginPath();
	context.moveTo( -Body.halfShoulderLen, Body.shoulderY );
	context.lineTo( Body.halfShoulderLen, Body.shoulderY );
	context.stroke();
	
	/* Right Arm */
	context.save();
	context.translate( -Body.halfShoulderLen, Body.shoulderY );
	context.rotate( armAngle );
	context.beginPath();
	context.moveTo( -Body.armLen, -Body.halfThickness );
	context.lineTo( 0, 0 );
	context.stroke();
	context.restore();
	
	/* Left Arm */
	context.save();
	context.translate( Body.halfShoulderLen, Body.shoulderY );
	context.rotate( -armAngle );
	context.beginPath();
	context.moveTo( 0, 0 );
	context.lineTo( Body.armLen, 0 );
	context.stroke();
	context.restore();
	
	/* Hips */
	context.fillRect( -Body.halfHipsLen, Body.hipsY, Body.hipsLen, Body.thickness );
	
	/* Right Leg */
	context.save();
	context.translate( -Body.halfHipsLen, Body.hipsY );
	context.rotate( legAngle );
	context.fillRect( -Body.legLen, 0, Body.legLen, Body.thickness );
	context.restore();
	
	/* Left Leg */
	context.save();
	context.translate( Body.halfHipsLen, Body.hipsY );
	context.rotate( -legAngle );
	context.fillRect( 0, 0, Body.legLen, Body.thickness );
	context.restore();
};


