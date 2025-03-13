import Header from '../components/ui/Header';
import postits from '../assets/img/postits.jpeg';

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="container py-5 d-flex flex-column align-items-center text-center">
        <h1 className="display-4 fw-bold mb-4">
          Empower Your Habits, Transform Your Life
        </h1>

        <div className="col-md-8 mt-5">
          <p className="lead mb-4">
            Time is the one thing you can never get back. You’ll spend years
            sleeping, working, and lost in distractions. How much of your time
            is truly yours? How much of it is spent building the life you want?
          </p>

          <p className="lead mb-4">
            Habit Tracker was born as a web development student's final project,
            but it became something bigger: a tool designed to help you take
            control. Small daily actions create meaningful change, and with the
            right habits, you can transform your life.
          </p>

          <p className="lead mb-4">
            Our goal is to help thousands of people live more intentionally. We
            believe that building good habits shouldn't feel overwhelming.
            That's why we designed an intuitive, user-friendly app that makes
            staying consistent easier. <b>Simplicity is key.</b>
          </p>

          <p className="lead">
            Whether you want to boost productivity, improve your well-being, or
            become the best version of yourself, Habit Tracker is here for you.
            Start today—because your time is too valuable to waste.
          </p>
        </div>
        <div className="col-md-6 text-center mt-5">
          <img
            src={postits}
            alt="Tracking their habits"
            className="img-fluid"
            style={{ maxWidth: '80%', borderRadius: '10px' }}
          />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
