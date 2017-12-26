import { generateStatisticsRequest } from '../common/requestDataHelpers';

export default function sendStatistics({ getState }) {
  return next => (action) => {
    const statisticsRequest = generateStatisticsRequest(getState, action);

    console.log('statisticsRequest', statisticsRequest);

    // fetch('https://reporting-dot-linear-asset-184705.appspot.com/events', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(statisticsRequest),
    // })
    //   .then(response => {
    //     console.log('Pure statistics response', response);
    //     return response.json();
    //   })
    //   .then(response => {
    //     console.log('Statistic has been sent successfully', response);
    //   })
    //   .catch(err => console.error('An error has occurred', err));

    return next(action);
  }
}
