import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState
} from 'react';

type FilterContextType = {
  textFilter: string;
  setTextFilter: Dispatch<SetStateAction<string>>;
  isMyQuestionFilter: boolean;
  setIsMyQuestionFilter: Dispatch<SetStateAction<boolean>>;
  isAnsweredFilter: boolean;
  setIsAnsweredFilter: Dispatch<SetStateAction<boolean>>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const FilterContext = createContext({} as FilterContextType);

export function FilterContextProvider(props: AuthContextProviderProps) {
  const [textFilter, setTextFilter] = useState('');
  const [isMyQuestionFilter, setIsMyQuestionFilter] = useState(false);
  const [isAnsweredFilter, setIsAnsweredFilter] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        textFilter,
        setTextFilter,
        isMyQuestionFilter,
        setIsMyQuestionFilter,
        isAnsweredFilter,
        setIsAnsweredFilter
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
}
