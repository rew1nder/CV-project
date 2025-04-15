import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // loads tsparticles-slim
import { useCallback, useMemo } from "react";

// tsParticles Repository: https://github.com/matteobruni/tsparticles
// tsParticles Website: https://particles.js.org/
const ParticlesComponent = (props) => {
  // using useMemo is not mandatory, but it's recommended since this value can be memoized if static
  const options = useMemo(() => {
    return {
      background: {
        color: "#000", // set background color (black for dark mode)
      },
      fullScreen: {
        enable: true, // this will make the canvas fill the entire screen
        zIndex: -1, // this is the z-index value used when the fullScreen is enabled
      },
      particles: {
        number: {
          value: 100, // number of particles
        },
        links: {
          enable: true, // enabling links between particles
          distance: 150, // distance to link particles
          color: "#333", // темніший колір ліній (темно-сірий для графу)
          opacity: 0.7, // збільшена непрозорість ліній для кращої видимості
          width: 2, // товщина ліній між частинками
        },
        move: {
          enable: true, // enabling particle movement
          speed: { min: 1, max: 3 }, // random speed between min/max values
        },
        opacity: {
          value: { min: 0.3, max: 0.7 }, // transparency value for the particles
        },
        size: {
          value: { min: 1, max: 5 }, // random size for particles
        },
        color: {
          value: "#ffffff", // set the color of the particles to white (or any other color)
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true, // enables hover effect
            mode: "repulse", // make particles run away from the cursor
          },
        },
        modes: {
          repulse: {
            distance: 100, // distance of the particles from the cursor
          },
        },
      },
    };
  }, []);

  // useCallback is not mandatory, but it's recommended since this callback can be memoized if static
  const particlesInit = useCallback((engine) => {
    loadSlim(engine);
  }, []);

  // setting an id can be useful for identifying the right particles component
  return <Particles id={props.id} init={particlesInit} options={options} />;
};

export default ParticlesComponent;
