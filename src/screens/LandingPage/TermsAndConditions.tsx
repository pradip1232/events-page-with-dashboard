import React from 'react';

const TermsAndConditions: React.FC = () => {
  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '30px',
    marginBottom: '15px',
    color: '#2c3e50',
  };

  const subHeadingStyle = {
    fontSize: '20px',
    fontWeight: 600,
    marginTop: '25px',
    marginBottom: '10px',
    color: '#34495e',
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#2f2f2f',
    marginBottom: '12px',
  };

  const listStyle = {
    marginBottom: '12px',
    paddingLeft: '20px',
    color: '#2f2f2f',
    fontSize: '16px',
  };

  return (
    <div className="terms-and-conditions container py-4" style={{ maxWidth: '900px', margin: 'auto' }}>
      <h1 style={headingStyle}>Terms & Conditions</h1>
      <p style={paragraphStyle}>Welcome to clickngo.in</p>
      <p style={paragraphStyle}>
        These terms and conditions outline the rules and regulations for the use of clickngo.in’s Website,
        located at <a href="https://clickngo.in" target="_blank" rel="noopener noreferrer">https://clickngo.in</a>.
      </p>
      <p style={paragraphStyle}>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use clickngo.in
        if you do not agree to take all of the terms and conditions stated on this page.
      </p>

      <h2 style={subHeadingStyle}>Cookies</h2>
      <p style={paragraphStyle}>
        We employ the use of cookies. By accessing clickngo.in, you agreed to use cookies in agreement with our Privacy Policy.
      </p>

      <h2 style={subHeadingStyle}>License</h2>
      <p style={paragraphStyle}>
        Unless otherwise stated, clickngo.in and/or its licensors own the intellectual property rights for all material
        on clickngo.in. All intellectual property rights are reserved.
      </p>
      <p style={paragraphStyle}>You must not:</p>
      <ul style={listStyle}>
        <li>Republish material from clickngo.in</li>
        <li>Sell, rent or sub-license material from clickngo.in</li>
        <li>Reproduce, duplicate or copy material from clickngo.in</li>
        <li>Redistribute content from clickngo.in</li>
      </ul>

      <h2 style={subHeadingStyle}>Comments</h2>
      <p style={paragraphStyle}>
        Users may post and exchange opinions in certain areas of the website. clickngo.in does not filter or review
        Comments before they appear. Comments do not reflect our views.
      </p>

      <h2 style={subHeadingStyle}>Hyperlinking to Our Content</h2>
      <p style={paragraphStyle}>
        Certain organizations may link to our website without prior written approval, such as government agencies,
        search engines, and news organizations.
      </p>
      <p style={paragraphStyle}>
        Other organizations may request approval to link, which we may grant at our discretion.
      </p>

      <h2 style={subHeadingStyle}>iFrames</h2>
      <p style={paragraphStyle}>
        Without prior approval and written permission, you may not create frames around our webpages that alter the
        visual presentation of our site.
      </p>

      <h2 style={subHeadingStyle}>Content Liability</h2>
      <p style={paragraphStyle}>
        We are not responsible for any content that appears on your website. You agree to protect and defend us
        against all claims.
      </p>

      <h2 style={subHeadingStyle}>Your Privacy</h2>
      <p style={paragraphStyle}>Please read our Privacy Policy.</p>

      <h2 style={subHeadingStyle}>Reservation of Rights</h2>
      <p style={paragraphStyle}>
        We reserve the right to request the removal of any links to our website and to amend these terms and conditions at any time.
      </p>

      <h2 style={subHeadingStyle}>Removal of Links</h2>
      <p style={paragraphStyle}>
        If you find any link on our website offensive, feel free to contact us. We will consider link removal requests
        but are not obligated to respond.
      </p>

      <h2 style={subHeadingStyle}>Disclaimer</h2>
      <p style={paragraphStyle}>
        To the maximum extent permitted by law, we exclude all representations, warranties, and conditions relating to
        our website. Nothing in this disclaimer will:
      </p>
      <ul style={listStyle}>
        <li>Limit or exclude liability for death or personal injury</li>
        <li>Limit or exclude liability for fraud or fraudulent misrepresentation</li>
        <li>Limit any liabilities not permitted under applicable law</li>
        <li>Exclude any liabilities that may not be excluded under applicable law</li>
      </ul>
      <p style={paragraphStyle}>
        As long as the website and its services are provided free of charge, we will not be liable for any loss or damage.
      </p>
    </div>
  );
};

export default TermsAndConditions;
