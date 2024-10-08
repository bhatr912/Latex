const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Hardcoded LaTeX code
const latexCode = `
\\documentclass[a4paper,10pt]{article}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge Your Name} \\\\
    \\vspace{0.1cm}
    \\href{mailto:email@example.com}{email@example.com} | +123 456 7890 | \\href{https://github.com/yourgithub}{github.com/yourgithub} | \\href{https://linkedin.com/in/yourlinkedin}{linkedin.com/in/yourlinkedin}
\\end{center}

\\vspace{0.5cm}

\\section*{Experience}
\\textbf{Job Title} \\hfill \\textit{Company Name, Location} \\\\
\\textit{Start Date -- End Date} \\\\
\\begin{itemize}[leftmargin=0.5cm]
    \\item Brief description of your role and responsibilities.
    \\item Highlight key achievements or projects.
\\end{itemize}

\\vspace{0.3cm}

\\section*{Education}
\\textbf{Degree Title} \\hfill \\textit{Institution Name, Location} \\\\
\\textit{Year of Graduation} \\\\
\\begin{itemize}[leftmargin=0.5cm]
    \\item Relevant coursework or academic achievements.
\\end{itemize}

\\vspace{0.3cm}

\\section*{Skills}
\\begin{itemize}[leftmargin=0.5cm]
    \\item Skill 1
    \\item Skill 2
    \\item Skill 3
\\end{itemize}

\\vspace{0.3cm}

\\section*{Projects}
\\textbf{Project Title} \\hfill \\textit{Date} \\\\
\\begin{itemize}[leftmargin=0.5cm]
    \\item Brief project description and key technologies used.
\\end{itemize}

\\end{document}
`;

// Route to render LaTeX
app.get('/render', (req, res) => {
    const texFilePath = path.join(__dirname, 'document.tex');
    const pdfFilePath = path.join(__dirname, 'document.pdf');

    // Write the LaTeX code to a .tex file
    fs.writeFile(texFilePath, latexCode, (err) => {
        if (err) {
            return res.status(500).send('Error writing LaTeX file.');
        }

        // Compile the LaTeX file to PDF using pdflatex
        exec(`pdflatex -output-directory=${__dirname} ${texFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send('Error generating PDF.');
            }

            // Send the PDF as a response
            res.download(pdfFilePath, 'document.pdf', (err) => {
                if (err) {
                    console.error('Error sending the PDF file:', err);
                }

                // Clean up generated files
                fs.unlinkSync(texFilePath);
                fs.unlinkSync(pdfFilePath);
            });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
