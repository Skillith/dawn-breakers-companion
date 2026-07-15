import React, { useState } from 'react';
import { FileText, Printer, Download } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import confetti from 'canvas-confetti';

export default function ExportButton({ people, cities }) {
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#b8860b', '#d4af37', '#5c4f48']
    });
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      // Build the Word document using the docx library
      const doc = new Document({
        creator: "Dawn-Breakers Study Companion",
        title: "Dawn-Breakers Companion Guide",
        description: "Alphabetical directory of names, cities, events, and page references.",
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                text: "The Dawn-Breakers Study Companion",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                text: "Alphabetical Directory of Historical Figures & Places",
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 }
              }),
              
              // Intro
              new Paragraph({
                children: [
                  new TextRun({
                    text: "This companion guide is designed to assist readers in tracking the names, titles, relationships, origin cities, and events in Nabíl's Narrative of the early days of the Bahá'í Revelation. Page numbers correspond to the standard 488-page English edition.",
                    italics: true
                  })
                ],
                spacing: { after: 600 }
              }),

              new Paragraph({
                text: "Part I: Historical Figures & Disciples",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
              }),

              // People loop
              ...people.flatMap(person => [
                new Paragraph({
                  text: person.name,
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Titles / Aliases: ", bold: true }),
                    new TextRun({ text: person.titles.join(", ") }),
                    new TextRun({ text: "  |  Origin: ", bold: true }),
                    new TextRun({ text: person.cityOfOrigin || "Unknown" }),
                    new TextRun({ text: "  |  Page References: ", bold: true }),
                    new TextRun({ text: person.pages.length > 0 ? person.pages.join(", ") : "None" })
                  ],
                  spacing: { after: 150 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: person.bio })
                  ],
                  spacing: { after: 150 }
                }),
                ...(person.confusionAlert && people.some(p => p.id !== person.id && p.name === person.name) ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Avoid Confusion: ", bold: true, color: "8b0000" }),
                      new TextRun({ text: person.confusionAlert, italics: true })
                    ],
                    spacing: { after: 150 }
                  })
                ] : []),
                ...(person.relations && person.relations.length > 0 ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Relations: ", bold: true }),
                      new TextRun({ text: person.relations.map(r => `${r.type} ${people.find(p => p.id === r.targetId)?.name || r.targetId}`).join("; ") })
                    ],
                    spacing: { after: 300 }
                  })
                ] : [
                  new Paragraph({ text: "", spacing: { after: 150 } })
                ])
              ]),

              new Paragraph({
                text: "Part II: Cities & High-Level Events",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 600, after: 200 }
              }),

              // Cities loop
              ...cities.flatMap(city => [
                new Paragraph({
                  text: city.name,
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: `Page References: ${city.pages.join(", ")}`, bold: true })
                  ],
                  spacing: { after: 150 }
                }),
                ...city.events.map(event => (
                  new Paragraph({
                    children: [
                      new TextRun({ text: `• ${event.title}: `, bold: true }),
                      new TextRun({ text: event.description })
                    ],
                    spacing: { after: 100 }
                  })
                )),
                new Paragraph({ text: "", spacing: { after: 300 } })
              ]),

              new Paragraph({
                text: "Part III: Narrative Timeline & Chronology",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 600, after: 200 }
              }),
              new Paragraph({
                text: "Historical figures listed in the chronological order of their appearance in Nabíl's Narrative:",
                spacing: { after: 300 }
              }),
              
              // Timeline loop
              ...[...people].sort((a, b) => {
                const pageA = a.storyAppearancePage || 999;
                const pageB = b.storyAppearancePage || 999;
                if (pageA !== pageB) return pageA - pageB;
                return a.name.localeCompare(b.name);
              }).flatMap(person => [
                new Paragraph({
                  children: [
                    new TextRun({ text: `Page ${person.storyAppearancePage || 'Unknown'}: `, bold: true }),
                    new TextRun({ text: person.name, bold: true, color: "b8860b" }),
                    new TextRun({ text: ` (c. ${person.storyAppearanceYear || 'Unknown'})` })
                  ],
                  spacing: { before: 150, after: 50 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: person.titles && person.titles.length > 0 ? `Titles: ${person.titles.join(", ")} | ` : "" }),
                    new TextRun({ text: person.cityOfOrigin ? `Origin: ${person.cityOfOrigin} | ` : "" }),
                    new TextRun({ text: `Category: ${person.category}` })
                  ],
                  italics: true,
                  spacing: { after: 100 }
                }),
                new Paragraph({
                  text: person.bio.length > 250 ? `${person.bio.substring(0, 247)}...` : person.bio,
                  spacing: { after: 200 }
                })
              ])
            ]
          }
        ]
      });

      // Save document to file
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "The-Dawn-Breakers-Companion-Guide.docx";
      link.click();
      URL.revokeObjectURL(url);
      
      triggerConfetti();
    } catch (error) {
      console.error("Failed to generate Word document:", error);
      alert("Error generating Word document. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="action-buttons">
      <button 
        onClick={handlePrint}
        className="action-btn secondary"
        title="Print booklet or save as PDF offline"
      >
        <Printer size={18} />
        Print Booklet / PDF
      </button>
      
      <button 
        onClick={handleExportDocx}
        className="action-btn primary"
        disabled={isExporting}
        title="Download the full directory as a Microsoft Word Document"
      >
        <FileText size={18} />
        {isExporting ? "Exporting..." : "Export to Word (.docx)"}
      </button>
    </div>
  );
}
