import { useQuery } from 'react-query';
import { getJson } from '../utils/request';


export default function CheckID({ next }: { next: (newData: object) => void }) {
  const params = new URLSearchParams(window.location.search);

  const { isLoading, data: result} = useQuery<{ duplicate: boolean } | { errors: Array<unknown> }, Error>({
    queryKey: ['valid'],
    queryFn: () => getJson(`/checkid?id=${params.get('id')}`),
  });

  if(params.get('id') === undefined || params.get('id') === null){
    return <p>No ID specified, please contact the experimenters!</p>;
  }

  if (isLoading) {
    return <p>Checking ID</p>;
  }

  if (!result ||!('duplicate' in result)) {
    console.log(result)
    return <p>Internal Error. please contact the experimenters!</p>;
  }

  if (result.duplicate) {
    return <p>Duplicate ID. please contact the experimenters!</p>;
  }

  next({id: params.get('id')});
  return <></>;
}
