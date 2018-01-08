import React from 'react';
import glamorous from 'glamorous';

const TextWrapper = glamorous.div({
  width: '80%',
  margin: '30px auto',
});

const Heading = glamorous.h3({
  fontSize: '24px'
});

const Text = glamorous.p({
  fontSize: '16px'
});

const PrivacyPolicy = (props) => (
  <TextWrapper className="PrivacyPolicy">
    <Heading>Privacy Policy</Heading>
    <small>Last updated: 2017-12-30</small>
    <Text>Smail ("us", "we", or "our") operates <a href="https://www.smail.rocks">https://www.smail.rocks</a> (the "Site") and the associated mobile applications (the &ldquo;Apps&rdquo;). Smail offers to their users the possibility of taking a picture of a letter they have and receive it, translated, on their e-mail inbox (the &ldquo;Service&rdquo;). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of our Service.</Text>
    <Text>We use Personal Information only for providing and improving the Services. By using the Services, you agree to the collection and use of information in accordance with this policy.</Text>
    <Heading>Information Collection And Use</Heading>
    <Text>While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your e-mail ("Personal Information").</Text>
    <Text>While using the Apps, we collect personal information about the User that is essential for the Service. This personal information contains, but is not limited to, private mails received by the user, their e-mail address as well as some information about the device they own</Text>
    <Heading>Log Data</Heading>
    <Text>Like many site and app operators, we collect information that your browser and device send whenever you use our Services ("Log Data").</Text>
    <Text>This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser and device type, browser and device version, the pages of our Site that you visit, the time and date of your use of our Services, the time spent on those pages and other statistics. These statistics are crucial for us to understand what our users (dis-) like about our Services and will help us tremendously in shaping the development of new features.</Text>
    <Text>In addition, we may use third party services such as Google Analytics and Facebook Messenger that collect, monitor and analyze this data. Please understand that such tools are created and managed by parties outside of our control. As such, we are not responsible for what information is actually captured by such third parties or how such third parties use and protect that information.</Text>
    <Heading>Protecting your privacy</Heading>
    <Text> It is important for us to know that our Users can trust us and use our App to scan and archive their mail safely. This is why we have decided we will NEVER share with any third-party the content of your mail to the exception where you request a human translation. In this case, please be assured that the person translating your mail will treat it with the utmost care to ensure your privacy is safe.</Text>
    <Text>In our quest to providing a perfect service that makes our Users&rsquo; lives much easier and comfortable, we might analyze your mail anonymously. This will always happen in a controlled and safe environment to ensure your data is not leaked.</Text>
    <Heading>Communications</Heading>
    <Text>We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information that we think is worth sharing. It is of course possible for you to unsubscribe at any moment from those e-mails. Unsubscribing from newsletters, marketing or promotional materials will not unsubscribe you from receiving the mail you scan with your phone.</Text>
    <Heading>Cookies</Heading>
    <Text>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.</Text>
    <Text>Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</Text>
    <Heading>Security</Heading>
    <Text>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</Text>
    <Heading>Changes To This Privacy Policy</Heading>
    <Text>This Privacy Policy is effective as of December 30th 2017 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</Text>
    <Text>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</Text>
    <Text>If we make any significant changes to this Privacy Policy, especially regarding the handling of your mail, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website and by displaying a notification on the App.</Text>
    <Heading>Contact Us</Heading>
    <Text>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:smail.app.rocks@gmail.com">smail.app.rocks@gmail.com</a></Text>
  </TextWrapper>
);

export default PrivacyPolicy;
