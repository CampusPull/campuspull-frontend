import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Network, Lightbulb, Globe, HeartHandshake } from "lucide-react";

const ValuesAndPrinciples = () => {
  const [selected, setSelected] = useState(0);

  const coreValues = [
    {
      title: "Student-First Philosophy",
      description:
        "Every decision centers around student success and growth, ensuring learning always comes first.",
      icon: <Users className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Connections",
      description:
        "Creating strong bonds between students, alumni, and faculty to open doors for opportunities.",
      icon: <Network className="w-8 h-8 text-purple-600" />,
    },
    {
      title: "Inter-College Collaboration",
      description:
        "Building bridges between colleges so students gain wider networks and experiences.",
      icon: <Globe className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Innovation",
      description:
        "Encouraging creativity and problem-solving to prepare for future challenges.",
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "Community Growth",
      description:
        "Together we create a stronger ecosystem of careers, mentorship, and knowledge sharing.",
      icon: <HeartHandshake className="w-8 h-8 text-pink-500" />,
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 mb-12 rounded-2xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-12">
        Our Values & Principles 🌟
      </h2>

      {/* Selected Card Highlight */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <div className="flex justify-center mb-4">{coreValues[selected].icon}</div>
        <h3 className="text-2xl font-bold text-indigo-700 mb-3">
          {coreValues[selected].title}
        </h3>
        <p className="text-gray-600 text-lg">{coreValues[selected].description}</p>
      </motion.div>

      {/* Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        {coreValues.map((value, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer p-6 rounded-2xl shadow-md transition-all duration-300 ${
              selected === index
                ? "bg-indigo-600 text-white shadow-xl"
                : "bg-white text-gray-700 hover:shadow-lg"
            }`}
            onClick={() => setSelected(index)}
          >
            <div className="flex justify-center mb-3">
              {React.cloneElement(value.icon, {
                className: `w-8 h-8 ${
                  selected === index ? "text-white" : "text-indigo-600"
                }`,
              })}
            </div>
            <h4 className="text-lg font-semibold text-center mb-2">
              {value.title}
            </h4>
            <p className="text-sm text-center">
              {value.description.length > 70
                ? value.description.substring(0, 70) + "..."
                : value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ValuesAndPrinciples;
