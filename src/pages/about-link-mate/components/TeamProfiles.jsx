import React from "react";

const TeamProfiles = () => {
  const team = [
    { name: "Satyam Sagar", role: "The Hacker", image: "/assets/images/satyam.jpg" },
    { name: "Zaid", role: "The Hustler", image: "/assets/images/zaid.jpg" },
    { name: "Sanskriti", role: "The Scout", image: "/assets/images/myphoto.jpg" },
    { name: "Sakshi Sharma", role: "The Curator", image: "/assets/images/sakshi.jpg" },
    { name: "Shoiab", role: "The Storyteller", image: "/assets/images/shoiab.jpg" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Meet Our Team 👩‍💻👨‍💻
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transform transition hover:scale-105"
          >
            {/* Gradient border + Image */}
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[3px] shadow-lg mb-4">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Role */}
            <h3 className="text-xl font-semibold text-gray-800">
              {member.name}
            </h3>
            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamProfiles;
