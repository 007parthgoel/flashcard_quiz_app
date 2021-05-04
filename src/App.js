import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import FlashcardList from './FlashcardList';

export default function App() {

  const [flashcards, setflashcards] = useState(SAMPLE_FLASHCARDS);
  const [categories, setCategories] = useState([]);
  const amountEl = useRef();
  const categoryEl = useRef();

  useEffect(() => {
    axios.
      get('https://opentdb.com/api_category.php').then(res => {
        setCategories(res.data.trivia_categories);
      })
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function submitHandler(e) {
    e.preventDefault();
    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value,
      }
    }).then(res => {
      setflashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer);
        const options = [
          ...questionItem.incorrect_answers.map(ans => decodeString(ans)),
          answer
        ];
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }));
    })
  };

  return (
    <>
      <form className="header" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" id="amount" ref={amountEl} min="1" step="1" defaultValue={10} />
        </div>
        <div className="form-group">
          <button className="btn" type="submit">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

const SAMPLE_FLASHCARDS = [{
  id: 1,
  question: 'what is your name',
  options: [1, 2, 3, 4],
  answer: 'parth'
},
{
  id: 2,
  question: 'what is your name2',
  options: ['ans1', 'ans2', '3', '4'],
  answer: 'parth2'
}, {
  id: 3,
  question: 'what is your name3',
  options: [1, 2, 3, 4],
  answer: 'parth3'
}];