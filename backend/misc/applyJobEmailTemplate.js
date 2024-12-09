const getJobApplicationEmailTemplate = (jobTitle, companyName, applicantDetails) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
    <div style="background-color: #0e003f; color: #fff; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 24px;">ZenSkills</h2>
    </div>
    
    <div style="padding: 20px;">
      <h3 style="font-size: 20px; color: #0e003f;">📄 New Application for "${jobTitle}" at ${companyName}</h3>
      <p style="margin: 10px 0;">You have received a new job application via ZenSkills. Below are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${applicantDetails.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${applicantDetails.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone Number:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${applicantDetails.phone_number}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Cover Letter:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${applicantDetails.cover_letter}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Resume:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="${applicantDetails.resume_url}">View Resume</a></td>
        </tr>
      </table>
      
      <p>We encourage you to review the application and reach out to the applicant if their qualifications meet your requirements.</p>
      <p>Thank you for using ZenSkills to find the best candidates for your job openings. If you have any questions or need further assistance, please do not hesitate to contact us.</p>
      
      <p>Best regards,<br>The ZenSkills Team</p>
      <hr>
      <p style="font-size: 0.9em;">ZenSkills<br>Empowering Careers, Enabling Success</p>
    </div>
  </div>
`;

module.exports = { getJobApplicationEmailTemplate };