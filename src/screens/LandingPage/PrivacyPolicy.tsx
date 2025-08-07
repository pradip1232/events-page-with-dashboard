import React from 'react';

const PrivacyPolicy: React.FC = () => {
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
        <div className="privacy-policy container py-4" style={{ maxWidth: '900px', margin: 'auto' }}>
            <h1 style={headingStyle}>Privacy Policy</h1>

            <p style={paragraphStyle}>
                At clickngo.in, accessible from{' '}
                <a href="https://clickngo.in" target="_blank" rel="noopener noreferrer">
                    https://clickngo.in
                </a>, one of our main priorities is the privacy of our visitors.
                This Privacy Policy document contains types of information that are collected and recorded by clickngo.in and how we use it.
            </p>

            <p style={paragraphStyle}>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <p style={paragraphStyle}>
                This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in clickngo.in. This policy is not applicable to any information collected offline or via channels other than this website.
            </p>

            <h2 style={subHeadingStyle}>Consent</h2>
            <p style={paragraphStyle}>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            <h2 style={subHeadingStyle}>Information We Collect</h2>
            <p style={paragraphStyle}>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear at the point we ask you to provide your personal information.
            </p>
            <p style={paragraphStyle}>
                If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>
            <p style={paragraphStyle}>
                When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
            </p>

            <h2 style={subHeadingStyle}>How We Use Your Information</h2>
            <ul style={listStyle}>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, including for customer service and updates</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
            </ul>

            <h2 style={subHeadingStyle}>Log Files</h2>
            <p style={paragraphStyle}>
                clickngo.in follows a standard procedure of using log files. These files log visitors when they visit websites.
                All hosting companies do this as part of hosting services’ analytics. The information collected by log files includes IP addresses, browser type, ISP, date/time stamp, referring/exit pages, and number of clicks.
                These are not linked to any personally identifiable information.
            </p>

            <h2 style={subHeadingStyle}>Cookies and Web Beacons</h2>
            <p style={paragraphStyle}>
                Like any other website, clickngo.in uses 'cookies' to store information including visitors’ preferences, and the pages on the website visited.
                The information is used to optimize users’ experience by customizing content based on browser type and/or other information.
            </p>
            <p style={paragraphStyle}>For more general information on cookies, please read “What Are Cookies”.</p>

            <h2 style={subHeadingStyle}>Google DoubleClick DART Cookie</h2>
            <p style={paragraphStyle}>
                Google is a third-party vendor on our site. It uses cookies (DART cookies) to serve ads based on your visit to www.website.com and other sites.
                You can opt out of DART cookies by visiting{' '}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                    Google Ads Privacy Policy
                </a>.
            </p>

            <h2 style={subHeadingStyle}>Advertising Partners</h2>
            <p style={paragraphStyle}>
                Third-party advertisers on clickngo.in may use cookies, JavaScript, or Web Beacons. They automatically receive your IP address to personalize ads and measure campaign effectiveness.
            </p>
            <p style={paragraphStyle}>
                clickngo.in has no control over cookies used by third-party advertisers.
            </p>

            <h2 style={subHeadingStyle}>Third-Party Privacy Policies</h2>
            <p style={paragraphStyle}>
                Our Privacy Policy does not apply to other websites or advertisers. We recommend checking their respective policies for more information on their practices.
            </p>
            <p style={paragraphStyle}>
                You can disable cookies via browser settings. More info is available on your browser’s website.
            </p>

            <h2 style={subHeadingStyle}>CCPA Privacy Rights</h2>
            <p style={paragraphStyle}>Under the CCPA, California consumers can:</p>
            <ul style={listStyle}>
                <li>Request to see the personal data collected</li>
                <li>Request deletion of their personal data</li>
                <li>Request that their data not be sold</li>
            </ul>
            <p style={paragraphStyle}>We respond to requests within one month. Contact us to proceed.</p>

            <h2 style={subHeadingStyle}>GDPR Data Protection Rights</h2>
            <p style={paragraphStyle}>You have the right to:</p>
            <ul style={listStyle}>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to processing</li>
                <li>Request data portability</li>
            </ul>
            <p style={paragraphStyle}>We respond to GDPR requests within one month. Contact us for support.</p>

            <h2 style={subHeadingStyle}>Children’s Information</h2>
            <p style={paragraphStyle}>
                We encourage parents to monitor children's online activity. clickngo.in does not knowingly collect data from children under 13.
            </p>
            <p style={paragraphStyle}>
                If you believe your child submitted personal data to us, please contact us, and we will remove it promptly.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
