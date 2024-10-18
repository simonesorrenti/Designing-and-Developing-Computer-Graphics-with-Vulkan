#version 450
#extension GL_ARB_separate_shader_objects : enable
layout(binding = 0) uniform UniformBufferObject {
	mat4 mvpMat;
	mat4 mMat;
	mat4 nMat;
} ubo;
layout(location = 0) in vec3 inPosition; // local position of vertex
layout(location = 1) in vec3 inNormal; // local normal vector of vertex
layout(location = 2) in vec2 inTexCoord; // uv coordinates of this vertex

layout(location = 0) out vec3 fragPos;
layout(location = 1) out vec3 fragNorm;
layout(location = 2) out vec2 fragTexCoord;
void main() {
	// from local coordinates to clipping coordinates of vertex
	gl_Position = ubo.mvpMat * vec4(inPosition, 1.0);
	// from local to global position coordinates with world matrix
	fragPos = (ubo.mMat * vec4(inPosition, 1.0)).xyz;
	// from local to global normal vector with world matrix
	fragNorm = mat3(ubo.nMat) * inNormal;
	fragTexCoord = inTexCoord;
}