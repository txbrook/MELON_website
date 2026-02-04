import { Box } from '@mui/material';
import { motion } from 'motion/react';

// Dot pattern for whiteboard effect
const DotPattern = () => (
  <svg
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.15,
    }}
  >
    <defs>
      <pattern
        id="dots"
        x="0"
        y="0"
        width="30"
        height="30"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.5" fill="#F0A8D0" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

// Floating spatial elements
const FloatingShape = ({ 
  delay, 
  duration, 
  x, 
  y, 
  size, 
  color, 
  initialX, 
  initialY,
  shape = 'circle' 
}: any) => (
  <motion.div
    animate={{
      x: [0, x, 0],
      y: [0, y, 0],
      rotate: shape === 'circle' ? [0, 360] : [0, 180, 360],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    style={{
      position: 'absolute',
      left: initialX,
      top: initialY,
      width: size,
      height: size,
      background: color,
      borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '30%' : '20%',
      opacity: 0.06,
      pointerEvents: 'none',
      filter: 'blur(1px)',
    }}
  />
);

// Subtle connecting lines
const ConnectionLine = ({ delay, x1, y1, x2, y2 }: any) => (
  <motion.svg
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.04, 0] }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
    }}
  >
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#D45D9F"
      strokeWidth="1.5"
      strokeDasharray="8,12"
    />
  </motion.svg>
);

export default function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #FDF5FA 0%, #FCE8F3 50%, #FDF5FA 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid pattern - whiteboard style */}
      <DotPattern />

      {/* Subtle connection lines */}
      <ConnectionLine delay={0} x1="15%" y1="25%" x2="45%" y2="55%" />
      <ConnectionLine delay={3} x1="65%" y1="20%" x2="85%" y2="65%" />
      <ConnectionLine delay={5} x1="25%" y1="75%" x2="60%" y2="35%" />
      <ConnectionLine delay={2} x1="75%" y1="30%" x2="40%" y2="80%" />

      {/* Large floating shapes */}
      <FloatingShape 
        delay={0} 
        duration={28} 
        x={100} 
        y={-80} 
        size="320px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="8%"
        initialY="12%"
        shape="circle"
      />
      
      <FloatingShape 
        delay={3.5} 
        duration={24} 
        x={-120} 
        y={100} 
        size="280px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="68%"
        initialY="18%"
        shape="rounded"
      />

      <FloatingShape 
        delay={6} 
        duration={32} 
        x={90} 
        y={130} 
        size="240px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="82%"
        initialY="58%"
        shape="circle"
      />

      <FloatingShape 
        delay={2} 
        duration={26} 
        x={-70} 
        y={-100} 
        size="300px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="18%"
        initialY="68%"
        shape="rounded"
      />

      {/* Medium shapes */}
      <FloatingShape 
        delay={1.5} 
        duration={20} 
        x={70} 
        y={-70} 
        size="200px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="42%"
        initialY="28%"
        shape="circle"
      />

      <FloatingShape 
        delay={5} 
        duration={22} 
        x={-90} 
        y={80} 
        size="180px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="58%"
        initialY="72%"
        shape="rounded"
      />

      <FloatingShape 
        delay={4} 
        duration={25} 
        x={60} 
        y={-60} 
        size="220px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="88%"
        initialY="42%"
        shape="square"
      />

      {/* Small accent shapes */}
      <FloatingShape 
        delay={2.5} 
        duration={18} 
        x={50} 
        y={55} 
        size="140px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="28%"
        initialY="48%"
        shape="circle"
      />

      <FloatingShape 
        delay={7} 
        duration={30} 
        x={-60} 
        y={-45} 
        size="160px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="72%"
        initialY="38%"
        shape="rounded"
      />

      <FloatingShape 
        delay={4.5} 
        duration={21} 
        x={75} 
        y={95} 
        size="120px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="92%"
        initialY="82%"
        shape="circle"
      />

      {/* Tiny particles */}
      <FloatingShape 
        delay={1} 
        duration={16} 
        x={35} 
        y={45} 
        size="80px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="48%"
        initialY="52%"
        shape="circle"
      />

      <FloatingShape 
        delay={6.5} 
        duration={19} 
        x={-45} 
        y={-35} 
        size="90px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="62%"
        initialY="48%"
        shape="circle"
      />

      <FloatingShape 
        delay={3} 
        duration={17} 
        x={40} 
        y={50} 
        size="100px" 
        color="linear-gradient(135deg, #E879B9 0%, #D45D9F 100%)"
        initialX="22%"
        initialY="62%"
        shape="circle"
      />

      <FloatingShape 
        delay={5.5} 
        duration={23} 
        x={-50} 
        y={-55} 
        size="110px" 
        color="linear-gradient(135deg, #F0A8D0 0%, #E879B9 100%)"
        initialX="38%"
        initialY="88%"
        shape="rounded"
      />

      {/* Central pulsing glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(232,121,185,0.2) 0%, rgba(232,121,185,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}