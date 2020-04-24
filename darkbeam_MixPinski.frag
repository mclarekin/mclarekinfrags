
//MixPinski, code from M3D, Darkbeam
//rewrote 4D rotation and added different color calc 16/04/20


#include "MathUtils.frag"

#include "DE-Raytracer.frag"
#group Mixpinski
uniform int MI; slider[0,13,250]
uniform int ColorIterations;  slider[0,3,100]
uniform float bailout; slider[0,16,1024]
uniform float offsetD; slider[-20,0,20]

uniform float w; slider[-5,0,5]

uniform float scaleM; slider[0,2,4]
uniform vec4 scaleC; slider[(-5,-5,-5,-5),(0,0,0,0),(5,5,5,5)]
uniform vec4 offsetM; slider[(-5,-5,-5,-5),(0,0,0,0),(5,5,5,5)]

// rotation 4D
uniform bool rotate; checkbox[false]
uniform float anglXY; slider[-180.0,0.0,180.0]
uniform float anglYZ; slider[-180.0,0.0,180.0]
uniform float anglXZ; slider[-180.0,0.0,180.0]
uniform float anglXW; slider[-180.0,0.0,180.0]
uniform float anglYW; slider[-180.0,0.0,180.0]
uniform float anglZW; slider[-180.0,0.0,180.0]

uniform float DEtweak; slider[0.0,0.0,8.0]
	float M_PI_180 = PI/180.;
	float angleXY = anglXY * M_PI_180;
	float angleYZ = anglYZ * M_PI_180;
	float angleXZ = anglXZ * M_PI_180;
	float angleXW = anglXW * M_PI_180;
	float angleYW = anglYW * M_PI_180;
	float angleZW = anglZW * M_PI_180;

vec4 Rotate(vec4 z)
{
	vec4 tp;
	if (angleXY != 0.)
	{
		tp = z;
		z.x = tp.x * cos(angleXY) + tp.y * sin(angleXY);
		z.y = tp.x * -sin(angleXY) + tp.y * cos(angleXY);
	}
	if (angleYZ != 0.)
	{
		tp = z;
		z.y = tp.y * cos(angleYZ) + tp.z * sin(angleYZ);
		z.z = tp.y * -sin(angleYZ) + tp.z * cos(angleYZ);
	}
	if (angleXZ != 0.)
	{
		tp = z;
		z.x = tp.x * cos(angleXZ) + tp.z * sin(angleXZ);
		z.z = tp.x * -sin(angleXZ) + tp.z * cos(angleXZ);
	}
	if (angleXW != 0.)
	{
		tp = z;
		z.x = tp.x * cos(angleXW) + tp.w * sin(angleXW);
		z.w = tp.x * -sin(angleXW) + tp.w * cos(angleXW);
	}
	if (angleYW != 0.)
	{
		tp = z;
		z.y = tp.y * cos(angleYW) + tp.w * sin(angleYW);
		z.w = tp.y * -sin(angleYW) + tp.w * cos(angleYW);
	}
	if (angleZW != 0.)
	{
		tp = z;
		z.z = tp.z * cos(angleZW) + tp.w * sin(angleZW);
		z.w = tp.z * -sin(angleZW) + tp.w * cos(angleZW);
	}
	return z;
}

float DE(vec3 p)
{
	vec4 z=vec4(p,w);
	float r2=0.; 
	float Dd = 1.0;

	for(int i=0; i<MI && r2<bailout; i++){
	
	if(z.x+z.y<0.0) z.xy = -z.yx;
    if(z.x+z.z<0.0) z.xz = -z.zx;
    if(z.y+z.z<0.0) z.zy = -z.yz;
    if(z.x+z.w<0.0) z.xw = -z.wx;
    if(z.y+z.w<0.0) z.yw = -z.wy;
    if(z.z+z.w<0.0) z.zw = -z.wz;

		z+=offsetM;

	//4D rotation
	//	if(rotate) z = Rotate(z);

		z.x= scaleM *z.x-scaleC.x*( scaleM -1.);
    z.y= scaleM *z.y-scaleC.y*( scaleM -1.);
    z.w= scaleM *z.w-scaleC.w*( scaleM -1.);
    z.z-=0.5*scaleC.z*( scaleM -1.)/ scaleM ;
    z.z=-abs(-z.z);
    z.z+=0.5*scaleC.z*( scaleM -1.)/ scaleM ;
    z.z= scaleM *z.z;
		Dd *= scaleM; // for DE calc	

	//4D rotation
		if(rotate) z = Rotate(z);

		r2=z.x*z.x+z.y*z.y+z.z*z.z+z.w * z.w; // bailout criteia, and I added in the z.w part to see if it  necessary
		if (r2>bailout) break; // bailout do not remove... else you get overflows break exits from a cycle.

		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.xyz,r2)));	
		/*if (i<ColorIterations)
		{
			vec4 p = abs(z);
			orbitTrap.x = min(orbitTrap.x, abs(p.x-p.y-p.z+p.w));
			orbitTrap.y = min(orbitTrap.y, abs(p.x-p.y+p.z-p.w));
			orbitTrap.z = min(orbitTrap.z, abs(p.x+p.y-p.z+p.w));
			orbitTrap.w = min(orbitTrap.w, abs(p.x+p.y+p.z-p.w));
		}*/




  }
	float r = sqrt(r2);
	return (r - offsetD) / abs(Dd); // offsetD has a default of 0.0 which is the std case. The offsetD results are similar or maybe the same as adjusting Detail Level( Quality)
} 














#preset Default
FOV = 0.0991189
Eye = 11.5553,-0.003452,0.0163216
Target = 8.6001,0.003585,-0.0291466
Up = 0.0003213,0.0001754,-0.0208531
AutoFocus = false
Gamma = 1.501706
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
Detail = -3.894091
FudgeFactor = 0.2
Dither = 0.5
NormalBackStep = 1 NotLocked
CamLight = 0.5137255,0.5137255,0.5137255,1.281623
BaseColor = 0.9215686,0.9215686,0.9215686
OrbitStrength = 0.14286
X = 0.427451,0.09411765,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0146893
BackgroundColor = 0.8196078,0.8666667,0.8117647
GradientBackground = 2.707581
CycleColors = true
Cycles = 1.943098
EnableFloor = false NotLocked
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
scaleM = 2
scaleC = 1,1,0.5,0.5
offsetM = 0,0,0,0
w = 0
MI = 16
bailout = 1024
offsetD = 0
EquiRectangular = false
FocalPlane = 1.033295
Aperture = 0
ShowDepth = false
DepthMagnitude = 0
DetailAO = -1.452381
MaxDistance = 1000
MaxRaySteps = 739
AO = 0,0,0,0.7266436
Specular = 0.2233677
SpecularExp = 8.185054
SpecularMax = 10
SpotLight = 0.3176471,0.3176471,0.3176471,0.3333333
SpotLightDir = 0.1643192,0
CamLightMin = 0.12121
Glow = 0.7215686,0.8666667,1,0.2305006
GlowMax = 41
Fog = 0
HardShadow = 0.9941383 NotLocked
ShadowSoft = 0.2588235
QualityShadows = true
Reflection = 0 NotLocked
DebugSun = false NotLocked
#endpreset


