import React, { useState, useEffect, useCallback } from 'react';
import { getQuestions, updateQA } from '../../shared/api.js';
import Questions from './Questions.jsx';

const fetchData = async (product_id) => {
  const res = await getQuestions({ product_id, count: 1000 });
  const questions = res.data.results.sort(
    (a, b) => b.question_helpfulness - a.question_helpfulness
  );
  questions.forEach((q) => {
    const allAnswers = q.answers.sort(
      (a, b) => b.helpfulness - a.helpfulness
    );
    const sellerAnswers = allAnswers.filter((el) => el.answerer_name === 'Seller');
    q.answers = [...sellerAnswers, ...allAnswers];
  });
  return questions;
};

const QAsection = ({ product_id, product_name }) => {
  const [allQuestions, setQuestions] = useState([]);
  const [reportedAns, setReportedAns] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const questions = await fetchData(product_id);
      setQuestions(questions);
    };
    fetchDataAsync();
  }, [product_id]);

  const report = useCallback((id) => {
    setReportedAns((prevReportedAns) => [...prevReportedAns, id]);
    updateQA({ type: 'answers', section: 'report', ids: [id] });
  }, []);

  useEffect(() => {
    const reportAnswers = async () => {
      if (reportedAns.length) {
        await updateQA({ type: 'answers', section: 'report', ids: reportedAns });
      }
    };
    reportAnswers();
  }, [reportedAns, product_id]);

  return (
    <div id="main-QA" className="main-QA">
      <p id="header">QUESTIONS & ANSWERS</p>
      <Questions
        questions={allQuestions}
        product_id={product_id}
        product_name={product_name}
        report={report}
      />
    </div>
  );
};

export default QAsection;
