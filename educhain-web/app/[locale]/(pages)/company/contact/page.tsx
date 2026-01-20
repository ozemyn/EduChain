'use client';

import { useIntlayer } from 'next-intlayer';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import '../company.css';

export default function ContactPage() {
  const content = useIntlayer('company');
  const contact = content.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(contact.messageSent.value);
  };

  return (
    <>
      <Navbar />
      <div className="company-page motion-fade-in">
        <div className="page-content">
          {/* 页面头部 */}
          <header className="company-header">
            <div className="company-header-icon">📬</div>
            <h1>{contact.title.value}</h1>
            <p className="company-header-desc">{contact.description.value}</p>
          </header>

          <main className="company-main">
            {/* 联系表单 */}
            <section className="company-card glass-light">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{contact.form.name.value}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={contact.form.namePlaceholder.value}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{contact.form.email.value}</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder={contact.form.emailPlaceholder.value}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{contact.form.subject.value}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={contact.form.subjectPlaceholder.value}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{contact.form.message.value}</label>
                  <textarea
                    className="form-textarea"
                    placeholder={contact.form.messagePlaceholder.value}
                    required
                  />
                </div>
                <button type="submit" className="form-submit motion-hover-lift">
                  {contact.form.submit.value}
                </button>
              </form>
            </section>

            {/* 联系信息 */}
            <section className="company-card glass-light">
              <h2>{contact.info.title.value}</h2>
              <div className="contact-info">
                {contact.info.items.map((item, index) => (
                  <div key={index} className="contact-item glass-light">
                    <div className="contact-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title.value}</h4>
                      <p>{typeof item.content === 'object' ? item.content.value : item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
