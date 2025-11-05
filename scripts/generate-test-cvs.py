#!/usr/bin/env python3
"""
Generate test CV PDF files for integration testing
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import os

def create_cv_pdf(filename, candidate_data):
    """Create a simple CV PDF"""
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(inch, height - inch, candidate_data['name'])

    # Contact
    c.setFont("Helvetica", 12)
    y = height - 1.5*inch
    c.drawString(inch, y, f"Email: {candidate_data['email']}")
    y -= 0.3*inch
    c.drawString(inch, y, f"Phone: {candidate_data['phone']}")
    y -= 0.5*inch

    # Summary
    c.setFont("Helvetica-Bold", 14)
    c.drawString(inch, y, "Professional Summary")
    c.setFont("Helvetica", 11)
    y -= 0.3*inch
    c.drawString(inch, y, candidate_data['summary'])
    y -= 0.5*inch

    # Experience
    c.setFont("Helvetica-Bold", 14)
    c.drawString(inch, y, "Experience")
    c.setFont("Helvetica", 11)
    y -= 0.3*inch
    for exp in candidate_data['experience']:
        c.drawString(inch, y, f"• {exp}")
        y -= 0.25*inch
    y -= 0.3*inch

    # Skills
    c.setFont("Helvetica-Bold", 14)
    c.drawString(inch, y, "Skills")
    c.setFont("Helvetica", 11)
    y -= 0.3*inch
    c.drawString(inch, y, candidate_data['skills'])
    y -= 0.5*inch

    # Education
    c.setFont("Helvetica-Bold", 14)
    c.drawString(inch, y, "Education")
    c.setFont("Helvetica", 11)
    y -= 0.3*inch
    c.drawString(inch, y, candidate_data['education'])

    c.save()
    print(f"✅ Created: {filename}")

# Test candidate data
candidates = [
    {
        'name': 'Alice Johnson',
        'email': 'alice.johnson@example.com',
        'phone': '+90 555 123 4567',
        'summary': 'Experienced QA Engineer with 5+ years in test automation, Playwright, and Python.',
        'experience': [
            'Senior QA Engineer at TechCorp (2020-2024)',
            'QA Automation Engineer at StartupXYZ (2018-2020)',
            'Junior QA at DevCompany (2016-2018)'
        ],
        'skills': 'Playwright, Puppeteer, Python, Selenium, Jest, CI/CD, Git, Docker',
        'education': 'B.S. Computer Science, Istanbul Technical University (2016)'
    },
    {
        'name': 'Bob Martinez',
        'email': 'bob.martinez@example.com',
        'phone': '+90 555 234 5678',
        'summary': 'Full-stack QA specialist with expertise in E2E testing and test framework design.',
        'experience': [
            'Lead QA Engineer at BigTech Inc (2019-2024)',
            'QA Engineer at MidSize Co (2017-2019)',
            'Test Analyst at SmallStartup (2015-2017)'
        ],
        'skills': 'Cypress, TestCafe, JavaScript, TypeScript, API Testing, Performance Testing',
        'education': 'B.S. Software Engineering, Bogazici University (2015)'
    },
    {
        'name': 'Carol Williams',
        'email': 'carol.williams@example.com',
        'phone': '+90 555 345 6789',
        'summary': 'Dedicated QA professional specializing in cross-browser testing and design validation.',
        'experience': [
            'QA Engineer at DesignStudio (2021-2024)',
            'Junior QA at WebAgency (2019-2021)',
            'QA Intern at SoftwareCo (2018-2019)'
        ],
        'skills': 'Playwright, Puppeteer, BrowserStack, Visual Regression Testing, Accessibility Testing',
        'education': 'B.S. Information Systems, Middle East Technical University (2018)'
    }
]

# Create CVs directory
cv_dir = os.path.join(os.path.dirname(__file__), '..', 'test-cvs')
os.makedirs(cv_dir, exist_ok=True)

# Generate PDFs
for i, candidate in enumerate(candidates, 1):
    filename = os.path.join(cv_dir, f'test-cv-{i}-{candidate["name"].replace(" ", "-").lower()}.pdf')
    create_cv_pdf(filename, candidate)

print(f"\n🎉 Generated {len(candidates)} test CV PDFs in: {cv_dir}")
