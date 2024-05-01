var raytraceFS = `
struct Ray {
	vec3 pos; // Position of the ray's origin
	vec3 dir; // Direction of the ray
};

struct Material {
	vec3  k_d;	// Diffuse reflection coefficient
	vec3  k_s;	// Specular reflection coefficient
	float n;	// Specular exponent for shininess
};

struct Sphere {
	vec3     center; // Center of the sphere
	float    radius; // Radius of the sphere
	Material mtl;    // Material properties of the sphere
};

struct Light {
	vec3 position;   // Position of the light source
	vec3 intensity;  // Intensity of the light source
};

struct HitInfo {
	float    t;        // Distance from ray origin to the intersection
	vec3     position; // Position of the intersection
	vec3     normal;   // Normal at the intersection
	Material mtl;      // Material of the intersected object
};

// Uniform variables set by the application
uniform Sphere spheres[ NUM_SPHERES ]; // Array of spheres in the scene
uniform Light  lights [ NUM_LIGHTS  ]; // Array of light sources in the scene
uniform samplerCube envMap;            // Environment map for background reflections
uniform int bounceLimit;               // Maximum number of allowed reflections


// Function to check if a shadow ray intersects any sphere before reaching the light
bool IntersectShadowRay(Ray ray){
	bool foundHit = false;
	for (int i=0; i<NUM_SPHERES; ++i) {
		Sphere sphere = spheres[i];
		// Compute discriminant to check ray-sphere intersection
		float discriminant = pow(dot(ray.dir, (ray.pos - sphere.center)), 2.0) -
			(dot(ray.dir, ray.dir) * (dot((ray.pos - sphere.center), (ray.pos - sphere.center)) - pow(sphere.radius, 2.0)));

		if (discriminant >= 0.0) {
			foundHit = true; 
		}

		// Compute t value for the closest intersection
		float tVal = ((-dot(ray.dir, (ray.pos-sphere.center))) - sqrt(discriminant)) / dot(ray.dir, ray.dir);
		if (tVal < 0.0) {
			foundHit = false;
		}
		
		if (foundHit) {
			return true;
		}	
	}
	return false;
}


// Function to find the first intersection of a ray with any sphere in the scene
bool IntersectRay(inout HitInfo hit, Ray ray) {
	hit.t = 1e30;
	bool foundHit = false;

	for (int i=0; i<NUM_SPHERES; ++i) {
		Sphere sphere = spheres[i];
		// Compute discriminant to check for ray-sphere intersection
		float discriminant = pow(dot(ray.dir, (ray.pos - sphere.center)), 2.0) - 
			(dot(ray.dir, ray.dir) * (dot((ray.pos - sphere.center), (ray.pos - sphere.center)) - pow(sphere.radius, 2.0)));

		if (discriminant >= 0.0) { // Intersection found
			// Compute t value for the closest intersection
			float t0 = (-(dot(ray.dir, (ray.pos-sphere.center))) - sqrt(discriminant)) / dot(ray.dir, ray.dir);
			if (t0 > 0.0 && t0 < hit.t) {
				foundHit = true;
				hit.t = t0; 
				hit.position = ray.pos + ray.dir * t0; 
				hit.normal = normalize((hit.position - sphere.center) / sphere.radius);
				hit.mtl = sphere.mtl;
			}	
		}
	}
	return foundHit;
}


// Function to compute shading at the intersection point
vec3 Shade(Material mtl, vec3 position, vec3 normal, vec3 view) {
	float epsilon = 0.003;
	vec3 ambientComponent = mtl.k_d * 0.05; // Ambient light component
	vec3 color = vec3(0.0);
	normal = normalize(normal);

	for (int i=0; i<NUM_LIGHTS; ++i) {
		// Construct a ray from the surface to the light
		Ray surfaceToLightRay; 
		surfaceToLightRay.dir = normalize(lights[i].position - position);
		surfaceToLightRay.pos = position + surfaceToLightRay.dir * epsilon;  

		// Check for shadows
		if (IntersectShadowRay(surfaceToLightRay)) {
			color += ambientComponent; // Add only ambient light if in shadow
		} else {
			// Perform Blinn-Phong shading
			vec3 lightDir = normalize(lights[i].position - position);
			float cosTheta = dot(normal, lightDir);
			vec3 diffuseComponent = mtl.k_d * lights[i].intensity * max(0.0, cosTheta);
			vec3 halfAngle = normalize(view + lightDir);
			vec3 specularComponent = mtl.k_s * lights[i].intensity * pow(max(0.0, dot(normal, halfAngle)), mtl.n);
			color += ambientComponent + diffuseComponent + specularComponent;
		}
	}
	return color;
}


// Main ray tracing function to compute the color of a ray through the scene
vec4 RayTracer( Ray ray )
{
	HitInfo hit;
	if ( IntersectRay( hit, ray ) ) {
		vec3 view = normalize( -ray.dir );
		vec3 clr = Shade( hit.mtl, hit.position, hit.normal, view );
		
		// Compute reflections
		vec3 k_s = hit.mtl.k_s;
		for ( int bounce=0; bounce<MAX_BOUNCES; ++bounce ) {
			if ( bounce >= bounceLimit ) break;
			if ( hit.mtl.k_s.r + hit.mtl.k_s.g + hit.mtl.k_s.b <= 0.0 ) break;
			
			Ray r;	// this is the reflection ray
			HitInfo h;	// reflection hit info
			
			// Initialize the reflection ray
			r.dir = normalize(ray.dir) - 2.0 * (dot(normalize(ray.dir), hit.normal))* hit.normal;
			r.pos = hit.position + (r.dir) * 0.0001;

			
			if ( IntersectRay( h, r ) ) {
				// TO-DO: Hit found, so shade the hit point
				// clr += vec3(h.normal); // Test reflection intersections
				// clr += vec3(1.0, 0.0, 0.0);
				clr += Shade(h.mtl, h.position, h.normal, view);
				
				//Update the loop variables for tracing the next reflection ray
				hit = h;
				ray = r;					
			} else {
				// The refleciton ray did not intersect with anything,
				// so we are using the environment color
				clr += k_s * textureCube( envMap, r.dir.xzy ).rgb;
				break;	// no more reflections
			}
		}
		
		return vec4( clr, 1 );	// Return the accumulated color with alpha 1
	} else {
		return vec4( textureCube( envMap, ray.dir.xzy ).rgb, 0 );	// Return environment color if no intersection
	}
}
`;