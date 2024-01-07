import React, { useEffect } from "react";
import * as THREE from "three";
import "./UserIcon.css";

function UserIcon() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);
    const iconContainer = document.getElementById("icon-container");
    if (iconContainer) {
      iconContainer.appendChild(renderer.domElement);
    }

    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: "#FFD700" });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.6;
    scene.add(head);

    const bodyGeometry = new THREE.SphereGeometry(
      1.5,
      32,
      32,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#1976D2" });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    scene.add(body);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      const amplitude = 2;
      const speed = 2;
      const delta = amplitude * Math.sin(speed * Date.now() * 0.001);
      iconContainer.style.transform = `translateX(${delta}em)`;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (iconContainer) {
        iconContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="icon-container" className="centered-container" />;
}

export default UserIcon;
