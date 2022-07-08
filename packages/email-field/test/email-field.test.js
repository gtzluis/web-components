import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-email-field.js';

const validAddresses = [
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'firstname+lastname@example.com',
  'email@123.123.123.123',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
];

const invalidAddresses = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'Joe Smith <email@example.com>',
  'email.example.com',
  'email@example@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example..com',
  'email@example',
];

describe('email-field', () => {
  describe('default', () => {
    let emailField;

    beforeEach(() => {
      emailField = fixtureSync('<vaadin-email-field></vaadin-email-field>');
    });

    describe('valid email addresses', () => {
      validAddresses.forEach((address) => {
        it(`should treat ${address} as valid`, () => {
          emailField.value = address;
          emailField.validate();
          expect(emailField.invalid).to.be.false;
        });
      });
    });

    describe('invalid email addresses', () => {
      invalidAddresses.forEach((address) => {
        it(`should treat ${address} as invalid`, () => {
          emailField.value = address;
          emailField.validate();
          expect(emailField.invalid).to.be.true;
        });
      });
    });
  });

  describe('custom pattern', () => {
    let emailField;

    beforeEach(() => {
      emailField = fixtureSync('<vaadin-email-field pattern=".+@example.com"></vaadin-email-field>');
    });

    it('should not override custom pattern', () => {
      expect(emailField.pattern).to.equal('.+@example.com');
    });
  });

  describe('invalid', () => {
    let field;

    beforeEach(() => {
      field = fixtureSync('<vaadin-email-field invalid></vaadin-email-field>');
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('invalid with value', () => {
    let field;

    beforeEach(() => {
      field = fixtureSync('<vaadin-email-field invalid value="foo@example.com"></vaadin-email-field>');
    });

    it('should not remove "invalid" state when ready', () => {
      expect(field.invalid).to.be.true;
    });
  });

  describe('initial validation', () => {
    let field, validateSpy;

    beforeEach(() => {
      field = document.createElement('vaadin-email-field');
      validateSpy = sinon.spy(field, 'validate');
    });

    afterEach(() => {
      field.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      field.value = 'foo@example.com';
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      field.value = 'foo@example.com';
      field.invalid = true;
      document.body.appendChild(field);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });

  describe('validation', () => {
    let field;

    beforeEach(() => {
      field = fixtureSync('<vaadin-email-field></vaadin-email-field>');
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      field.addEventListener('validated', validatedSpy);
      field.required = true;
      field.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });
});
