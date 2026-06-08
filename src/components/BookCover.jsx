export default function BookCover({ onStart }) {
  return (
    <div className="book-cover">
      <div className="cover-content">
        <div className="cover-decoration">
          <div className="cover-line cover-line-top"></div>
          <div className="cover-icon">&#128218;</div>
          <div className="cover-line cover-line-bottom"></div>
        </div>
        <h1 className="cover-title">GJUHET E PROGRAMIMIT</h1>
        <p className="cover-subtitle">
          Një udhëzues për 15 gjuhët më të njohura të programimit
        </p>
        <div className="cover-categories">
          <span className="cover-cat frontend">Frontend</span>
          <span className="cover-cat backend">Backend</span>
          <span className="cover-cat fullstack">Full Stack</span>
        </div>
        <button className="cover-btn" onClick={onStart}>
          Hape Librin
        </button>
      </div>
    </div>
  )
}
