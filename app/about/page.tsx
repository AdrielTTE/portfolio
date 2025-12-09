
export default function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      {/* 1. Header Section */}
      <h1 className="text-4xl font-extrabold mb-6">About Me</h1>
      
      {/* 2. Main Content Area */}
      <section className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-lg text-gray-700 mb-4">
          Hey there! Allow me to introduce myself. My name is Adriel, and I am a full stack developer who experience in both web development and mobile application development. My focus is on building high-performance, responsive, and user-friendly user interfaces.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          I am always eager to learn new methods and technologies; increasing my skill level with the goal of providing valueble output to my clients.
        </p>

        {/* 3. Skills/Tech Stack Showcase */}
        <h2 className="text-2xl font-bold mt-8 mb-4">My Core Skills</h2>
        <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
          <li>Front-End: React, Next.js, HTML, CSS, JavaScript</li>
          <li>Styling: Tailwind CSS, Bootstrap CSS</li>
          <li>Back-End/Tools: Node.js, Git/GitHub, REST APIs, NPM</li>
          <li>Frameworks: ASP.NET MVC Core, Flutter</li>
          <li>Programming Languages: Java, Dart, C#, C++, Python</li>
          <li>Database: MySQL</li>
        </ul>
      </section>
    </div>
  );
}