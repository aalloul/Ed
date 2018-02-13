import React from 'react';
import glamorous from 'glamorous';

import consts from '../../common/consts';

const ModalWindow = glamorous.div({
  display: 'none',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const ModalOverlay = glamorous.div({
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.7)',
});

const Form = glamorous.form({
  background: '#FFF',
  borderRadius: '5px',
  boxShadow: '0px 5px 15px 0px rgba(0, 0, 0, 0.004)',
  left: '50%',
  maxHeight: '600px',
  maxWidth: '900px',
  padding: '30px',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

const FormWrapper = glamorous.div({
  padding: '10px',
});

const ModalCloseIcon = glamorous.span({
  cursor: 'pointer',
  fontSize: '20px',
  position: 'absolute',
  right: '15px',
  top: '10px',
});

const ModalContent = glamorous.p({
  fontSize: '24px',
  color: 'rgb(51, 51, 51)',
  lineHeight: '1.2',
  margin: '0 0 20px 0',
  textAlign: 'center',
});

const EmailInput = glamorous.input({
  border: '2px #000 solid',
  borderStyle: 'solid',
  display: 'block',
  fontSize: '18px',
  height: '30px',
  margin: '10px auto',
  maxWidth: '265px',
  padding: '5px',
  width: '100%',
});

const Button = glamorous.input({
  textDecoration: 'none',
  background: consts.mainColor,
  borderRadius: '5px',
  padding: '0 30px',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '18px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.33)',
  display: 'block',
  height: '45px',
  lineHeight: 'normal',
  margin: '25px auto 0',
  paddingTop: '4px',
  textAlign: 'center',
  width: '170px',
  ':hover': {
    background: '#1efcd0',
    color: '#171838',
    textDecoration: 'none',
  }
});

const Error = glamorous.p({
  display: 'none',
  fontSize: '14px',
  margin: '10px 0',
});

const Successful = glamorous.p({
  color: '#15AA32',
  display: 'none',
  fontSize: '24px',
  lineHeight: '1.3',
  margin: '30px',
  textAlign: 'center',
});

export default () => (
  <ModalWindow id="notify-ios">
    <ModalOverlay id="notify-modal-overlay" />
    <Form id="notify-ios-form">
      <ModalCloseIcon id="notify-ios-close" title="Close">&times;</ModalCloseIcon>
      <FormWrapper id="notify-ios-form-wrapper">
        <ModalContent>
          Let us notify you <br />
          when iOS app will be ready
        </ModalContent>
        <EmailInput
          id="notify-ios-input"
          type="email"
          required
          placeholder="Email"
        />
        <Error id="notify-ios-error">An error happened, please try again</Error>
        <Button
          type="submit"
          value="SEND"
        />
      </FormWrapper>

      <Successful id="notify-ios-success">
        Successful! <br />
        You'll be notified as soon as iOS app is released.
      </Successful>
    </Form>
    <script dangerouslySetInnerHTML={{
      __html: `
        (function(){
          var modalOpenButtons = Array.prototype.slice.call(document.querySelectorAll('[data-modal="notify-ios"]'));

          var modalWindow = document.querySelector('#notify-ios');
          var modalForm = document.querySelector('#notify-ios-form');
          var modalFormWrapper = document.querySelector('#notify-ios-form-wrapper');
          var modalOverlay = document.querySelector('#notify-modal-overlay');
          var modalClose = document.querySelector('#notify-ios-close');
          var emailInput = document.querySelector('#notify-ios-input');
          var sendButton = document.querySelector('#notify-ios-button');

          var successful = document.querySelector('#notify-ios-success');
          var errorMessage = document.querySelector('#notify-ios-error');

          function openModal(event) {
            event.preventDefault();

            modalWindow.style.display = 'block';
            document.body.style.overflow = 'hidden';
          }

          function closeModal(event) {
            event && event.preventDefault();

            if (window.timer) {
              clearTimeout(window.timer);
            }

            modalWindow.style.display = 'none';
            modalFormWrapper.style.display = 'block';
            successful.style.display = 'none';
            document.body.style.overflow = 'auto';
          }

          function handleError(error) {
            errorMessage.style.display = 'block';
            errorMessage.innerText = error;
          }

          function handleComplete() {
            modalFormWrapper.style.display = 'none';
            successful.style.display = 'block';

            window.timer = window.setTimeout(closeModal, 10000);
          }

          modalForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var SERVER_URL = 'https://reporting-dot-linear-asset-184705.appspot.com/newProspect';
            var requestBody = {
              request_timestamp: Date.now(),
              email: emailInput.value,
              duration_visit: 10,
              datamodel_version: 0.1
            };

            fetch(SERVER_URL, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              mode: 'no-cors',
              body: JSON.stringify(requestBody),
            })
              .then((response) => {
                handleComplete();
              })
              .catch((err) => {
                handleError(err);
                console.error('error', err);
              });
          });

          emailInput.addEventListener('focus', function() {
            errorMessage.style.display = 'none';
          });

          modalOpenButtons.forEach(function(btn) {
            btn.addEventListener('click', openModal);
          });

          [modalOverlay, modalClose].forEach(function(element) {
            element.addEventListener('click', closeModal);
          });
        })();
      `}}
    >
    </script>
  </ModalWindow>
);