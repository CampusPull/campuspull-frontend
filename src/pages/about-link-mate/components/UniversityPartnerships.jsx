import React from "react";

const UniversityPartnerships = () => {
  return (
    <section className="bg-gray-50 py-16">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-12">
        🎓 Our University Partner
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-10">
        {/* Left Side: Logo + Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="/assets/images/ABESIT.png"
            alt="ABESIT Logo"
            className="w-72 h-auto mb-6"
          />

          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            ABES Institute of Technology (ABESIT)
          </h3>

          <p className="text-gray-600 italic text-lg mb-4">
            "Empowering Students, Shaping Futures 🚀"
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            {/* Official Website */}
            <a
              href="https://abesit.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full 
                         font-medium hover:bg-indigo-700 transition-colors"
            >
              Visit Official Website
            </a>

            {/* Google Maps Directions */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=ABES+Institute+of+Technology,+19th+KM+Stone,+NH24,+Ghaziabad,+UP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-full 
                         font-medium hover:bg-green-700 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Right Side: Google Map */}
        <div className="w-full h-[400px] shadow-lg rounded-lg overflow-hidden">
          <iframe
            title="ABESIT Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.9630905170486!2d77.4519931150824!3d28.646441882410464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf112b19b0d6f%3A0x9a2c0e9cfb0b1e4a!2sABES%20Institute%20of%20Technology%20(ABESIT)!5e0!3m2!1sen!2sin!4v1695294812345!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default UniversityPartnerships;
