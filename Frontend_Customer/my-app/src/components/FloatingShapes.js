import React from 'react';
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  const shapes = [
    { size: 60, left: '10%', top: '20%', delay: 0, color: 'bg-cyan-400/20' },
    { size: 80, left: '80%', top: '10%', delay: 0.5, color: 'bg-purple-400/20' },
    { size: 50, left: '70%', top: '60%', delay: 1, color: 'bg-pink-400/20' },
    { size: 70, left: '15%', top: '70%', delay: 1.5, color: 'bg-yellow-400/20' },
    { size: 45, left: '90%', top: '80%', delay: 2, color: 'bg-green-400/20' },
    { size: 55, left: '40%', top: '15%', delay: 2.5, color: 'bg-orange-400/20' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${shape.color} blur-xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotateZ: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional 3D geometric shapes */}
      <motion.div
        className="absolute top-40 left-1/4 w-24 h-24"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          z: [0, 100, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-lg backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-1/4 w-20 h-20"
        animate={{
          rotateX: [360, 0],
          rotateZ: [0, 360],
          z: [100, 0, 100],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full backdrop-blur-sm" />
      </motion.div>
    </div>
  );
};

export default FloatingShapes;

