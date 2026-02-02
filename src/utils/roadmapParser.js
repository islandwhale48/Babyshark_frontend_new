// Converts roadmap plain text into structured tasks by day ranges

export function parseRoadmapToTasks(roadmapText) {
  const lines = roadmapText.split("\n").map(l => l.trim());
  const sections = [];

  let currentSection = null;

  lines.forEach(line => {
    // Match: "Market Research (Days 1-3)"
    const sectionMatch = line.match(/(.+)\(Days?\s(\d+)-(\d+)\)/i);

    if (sectionMatch) {
      currentSection = {
        title: sectionMatch[1].trim(),
        startDay: Number(sectionMatch[2]),
        endDay: Number(sectionMatch[3]),
        tasks: []
      };
      sections.push(currentSection);
      return;
    }

    // Bullet points
    if (line.startsWith("*") || line.startsWith("-")) {
      if (currentSection) {
        currentSection.tasks.push(
          line.replace(/^[-*]\s*/, "")
        );
      }
    }
  });

  return sections;
}

export function getTasksForDay(sections, day) {
  return sections
    .filter(s => day >= s.startDay && day <= s.endDay)
    .flatMap(s =>
      s.tasks.map(task => ({
        id: `${day}-${task}`,
        title: task,
        completed: false,
        note: ""
      }))
    );
}
