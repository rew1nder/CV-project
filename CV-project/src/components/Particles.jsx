import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useMemo } from "react";
import { useMediaQuery } from "react-responsive";

const ParticlesComponent = (props) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const options = useMemo(() => {
    const baseConfig = {
      background: {
        color: "#000",
      },
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
      particles: {
        number: {
          value: isMobile ? 30 : 100, // Fewer particles on mobile
        },
        move: {
          enable: true,
          speed: { min: 1, max: 3 },
        },
        opacity: {
          value: { min: 0.3, max: 0.7 },
        },
        size: {
          value: { min: 1, max: 5 },
        },
        color: {
          value: "#ffffff",
        },
      },
    };

    if (!isMobile) {
      // Add links and interactivity for non-mobile devices
      baseConfig.particles.links = {
        enable: true,
        distance: 150,
        color: "#333",
        opacity: 0.7,
        width: 2,
      };
      baseConfig.interactivity = {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 100,
          },
        },
      };
    }

    return baseConfig;
  }, [isMobile]);

  const particlesInit = useCallback((engine) => {
    loadSlim(engine);
  }, []);

  return <Particles id={props.id} init={particlesInit} options={options} />;
};

export default ParticlesComponent;
