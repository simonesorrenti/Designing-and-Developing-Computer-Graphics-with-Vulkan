#version 450#extension GL_ARB_separate_shader_objects : enable

layout(binding = 1) uniform sampler2D texSampler;

layout(binding = 2) uniform GlobalUniformBufferObject {
	// lights parameters 
	vec3 lightDirFlashLight;
	vec3 lightColorFlashLight;
	vec3 lightPosFlashLight;
	vec4 factorsANDconesFlashLight;
	vec3 lightColorLantern;
	vec3 lightPosLantern1;
	vec3 lightPosLantern2;
	vec3 lightPosLantern3;
	vec3 lightPosLantern4;
	vec3 lightPosLantern5;
	vec3 lightPosLantern6;
	vec3 lightPosLantern7;
	vec3 lightPosLantern8;
	vec3 lightPosLantern9;
	vec3 lightPosLantern10;
	vec2 factorsLantern;
	vec3 AmbColor;
	vec3 eyePos;
	vec3 lightColorFire;
	vec3 lightPosFire;
	vec2 factorsFire;
	float spec;
} gubo;

layout(location = 0) in vec3 fragPos; // global coordinates of vertices
layout(location = 1) in vec3 fragNorm; //global normal vector
layout(location = 2) in vec2 fragTexCoord; //texture coordinates

layout(location = 0) out vec4 outColor;

vec3 Phong_Specular(vec3 L, vec3 N, vec3 V, vec3 C, float gamma)  {
	// Phong Specular BRDF model
	// additional parameter:
	// float gamma : exponent of the cosine term
	vec3  reflected_vector = - reflect(L,N);  // reflected vector
	// specular color *  intensity of the specular reflection
	return C * pow(clamp(dot(V, reflected_vector), 0, 1), gamma);   
}

vec3 Lambert_Diffuse(vec3 L, vec3 N, vec3 C) {
	// Lambert Diffuse BRDF model
	// in all BRDF parameters are:
	// vec3 L : light direction
	// vec3 N : normal vector
	// vec3 V : view direction
	// vec3 C : main color (diffuse color, or specular color)
	// diffuse color * the incidence of the incoming light
	return C * max(dot(L, N), 0);  
}

//sources that emit light from fixed points in the space, and do not have a direction.
vec3 point_light_dir(vec3 pos, vec3 lightPos) {
	// Point light direction
	vec3 vector_distance = lightPos - pos;  // The direction goes from point x to the center of the light
	return normalize(vector_distance);  //the light direction should be normalized to make it an unitary vector
}

// sources that emit light from fixed points in the space, and do not have a direction.
vec3 point_light_color(vec3 pos, vec3 lightPos, vec3 lightColor, float factor_g, float factor_b) {
	// Point light color
	vec3 vector_distance = lightPos - pos;
	float norm_vector = length(vector_distance);
	// the intensity of a point light reduces at a rate that is proportional to the inverse of the square of the distance
	float decay = pow(factor_g / norm_vector, factor_b);
	return lightColor * decay;
}

// special projectors that are used to illuminate specific objects or locations. They are conic sources 
vec3 spot_light_dir(vec3 pos, vec3 lightPos) {
	// Spot light direction
	vec3 vector_distance = lightPos - pos; // The direction goes from point x to the center of the light
	return normalize(vector_distance); //the light direction should be normalized to make it an unitary vector
}

// special projectors that are used to illuminate specific objects or locations. They are conic sources 
vec3 spot_light_color(vec3 pos, vec3 lightPos, vec3 lightColor, vec3 lightDir, float cos_c_out, float cos_c_in, float factor_g, float factor_b) {
	// Spot light color
	vec3 vector_distance = lightPos - pos;
	vec3 normalized_vector_distance = normalize(vector_distance);
	float norm_vector = length(vector_distance);
	// the intensity of a point light reduces at a rate that is proportional to the inverse of the square of the distance
	float decay = pow(factor_g / norm_vector, factor_b);
	// The cone dimming effect:
	float clamp = clamp((dot(normalized_vector_distance, lightDir) - cos_c_out) / (cos_c_in - cos_c_out), 0, 1);
	return lightColor * decay * clamp;
}

void main() {

	vec3 Norm = normalize(fragNorm); 
	vec3 EyeDir = normalize(gubo.eyePos.xyz - fragPos);
	vec4 DiffColor = texture(texSampler, fragTexCoord);
	
	vec3 Diffuse = vec3(0,0,0);
	vec3 Specular = vec3(0,0,0);

	// flashlight
	vec3 lD = spot_light_dir(fragPos, gubo.lightPosFlashLight);
	vec3 lC = spot_light_color(fragPos, gubo.lightPosFlashLight, gubo.lightColorFlashLight, gubo.lightDirFlashLight, gubo.factorsANDconesFlashLight.x, gubo.factorsANDconesFlashLight.y, gubo.factorsANDconesFlashLight.z, gubo.factorsANDconesFlashLight.w);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;
	Specular += Phong_Specular(lD, Norm, EyeDir, vec3(1,1,0.9), 200.0f) * lC;

	// lanterns
	lD = point_light_dir(fragPos, gubo.lightPosLantern1);
	lC = point_light_color(fragPos, gubo.lightPosLantern1, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern2);
	lC = point_light_color(fragPos, gubo.lightPosLantern2, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern3);
	lC = point_light_color(fragPos, gubo.lightPosLantern3, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern4);
	lC = point_light_color(fragPos, gubo.lightPosLantern4, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern5);
	lC = point_light_color(fragPos, gubo.lightPosLantern5, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern6);
	lC = point_light_color(fragPos, gubo.lightPosLantern6, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern7);
	lC = point_light_color(fragPos, gubo.lightPosLantern7, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern8);
	lC = point_light_color(fragPos, gubo.lightPosLantern8, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern9);
	lC = point_light_color(fragPos, gubo.lightPosLantern9, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	lD = point_light_dir(fragPos, gubo.lightPosLantern10);
	lC = point_light_color(fragPos, gubo.lightPosLantern10, gubo.lightColorLantern, gubo.factorsLantern.x, gubo.factorsLantern.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	// campfire
	lD = point_light_dir(fragPos, gubo.lightPosFire);
	lC = point_light_color(fragPos, gubo.lightPosFire, gubo.lightColorFire, gubo.factorsFire.x, gubo.factorsFire.y);
	Diffuse += Lambert_Diffuse(lD, Norm, DiffColor.xyz) * lC;

	// ambient
	vec3 Ambient = gubo.AmbColor * DiffColor.xyz;
	
	outColor = vec4(Diffuse + Specular + Ambient, DiffColor.w);
}