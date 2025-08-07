import React from 'react';

const RefundPolicy: React.FC = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Refund Policy</h1>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No Refund Policy</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                We do not issue refunds for any purchases made on our website <strong>www.clickngo.in</strong> or through an affiliate link. All sales are final.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Please ensure that you have carefully reviewed your purchase before completing the transaction. No exceptions will be made under any circumstances.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                If you have any questions, please contact us at <a href="mailto:support@clickngo.in">support@clickngo.in</a>.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Thank you for your understanding and cooperation.
            </p>
        </div>
    );
};

export default RefundPolicy;
