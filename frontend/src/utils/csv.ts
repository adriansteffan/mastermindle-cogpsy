/* eslint-disable @typescript-eslint/no-explicit-any */
// Generic type for all data structures
export interface StudyEvent {
  index: number;
  type: string;
  name: string;
  data: any;
  start: number;
  end: number;
  duration: number;
}

export function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const prefixedKey = prefix ? `${prefix}_${key}` : key;

    // Skip blob objects and complex voice response objects
    if (obj[key] && typeof obj[key] === 'object') {
      if ('blob' in obj[key] || 'url' in obj[key]) {
        return acc;
      }
    }

    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else if (!Array.isArray(obj[key])) {
      acc[prefixedKey] = obj[key];
    }
    return acc;
  }, {});
}

export function arrayToCSV(array: any[]): string {
  if (array.length === 0) return '';

  // Get all possible headers from all objects
  const headers = new Set<string>();
  array.forEach((obj) => {
    Object.keys(obj).forEach((key) => headers.add(key));
  });

  const headerRow = Array.from(headers).join(',');
  const rows = array.map((obj) =>
    Array.from(headers)
      .map((header) => {
        const value = obj[header];
        // Handle values that might need quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(','),
  );

  return [headerRow, ...rows].join('\n');
}

export function convertToCSV(studyData: StudyEvent[]) {
  // Initialize data collectors for each level
  const globalData: any[] = [];
  const blockData: any[] = [];
  const gameData: any[] = [];
  const guessData: any[] = [];

  studyData.forEach((event) => {
    // Flatten the base event data
    const baseEventData = flattenObject({
      index: event.index,
      type: event.type,
      name: event.name,
      duration: event.duration,
      start: event.start,
      end: event.end,
    });

    // Process global level Quest data
    if (event.type === 'Quest' && !event.name.includes('block_')) {
        globalData.push({
          ...baseEventData,
          ...flattenObject(event.data),
        });
      }

    // Process MasterMindle blocks
    if (event.name.includes('mastermindle')) {
      const blockPos = event.data.blockpos;

      // Find corresponding block survey
      const blockSurveyEvent = studyData.find(
        (e) => e.name === `block_${parseInt(blockPos) + 4}_survey`,
      );

      // Add block level data
      blockData.push({
        ...baseEventData,
        ...flattenObject(event.data),
        ...(blockSurveyEvent ? flattenObject(blockSurveyEvent.data, 'survey') : {}),
      });

      // Process games within block
      event.data.data.forEach((item: any) => {
        if (item.type === 'game') {
          // Find corresponding game survey
          const nextSurvey = event.data.data.find(
            (d: any) => d.type === 'survey' && d.index === item.index + 1,
          );

          // Format solution array
          const gameBaseData = {
            ...flattenObject(item),
            blockpos: blockPos,
            solution: item.data.solution.join('_'),
          };

          // Add game level data
          gameData.push({
            ...gameBaseData,
            ...flattenObject(item.data),
            index: item.index/2,
            ...(nextSurvey ? flattenObject(nextSurvey.data, 'survey') : {}),
          });

          // Process guesses within game
          item.data.guesses.forEach((guess: any) => {
            guessData.push({
              blockpos: blockPos,
              gameIndex: item.index/2,
              ...flattenObject(guess),
              colors: guess.colors.join('_'),
              results: guess.results.map((r: any) => r.status).join('_'),
            });
          });
        }
      });
    }
  });

  return {
    globalCsv: arrayToCSV(globalData),
    blockCsv: arrayToCSV(blockData),
    gameCsv: arrayToCSV(gameData),
    guessCsv: arrayToCSV(guessData),
  };
}

export default convertToCSV;
