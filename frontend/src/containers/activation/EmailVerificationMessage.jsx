import React from 'react';
import { Navbar } from '../../components';

function EmailVerificationMessage() {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>شكرًا لتسجيلك!</h2>
        <h1>يرجى التحقق من بريدك الإلكتروني لتأكيد عنوان بريدك الإلكتروني.</h1>
        <h1>بمجرد التحقق، ستتمكن من تسجيل الدخول والوصول إلى حسابك.</h1>

      </div>
    </>
  );
}
export default EmailVerificationMessage;
