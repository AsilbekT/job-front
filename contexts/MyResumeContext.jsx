import deepEqual from "deep-equal";
import { nanoid } from "nanoid";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { defaultFieldValues, fieldsListRecord } from "../data/defaultFieldValues";
import { useFetch } from "../hooks/useFetch";
import { UserContext } from "../pages/context/UserContext";

const MyResumeContext = createContext({});

export const useMyResumeContext = () => useContext(MyResumeContext);

export const MyResumeContextProvider = ({ children }) => {
  const fetchStates = {
    education: useFetch(),
    work_experience: useFetch(),
    award: useFetch(),
    skill: useFetch(),
  };
  const [loading, setLoading] = useState(false);

  const user = useContext(UserContext);

  const [activeFieldEditing, setActiveFieldEditing] = useState({
    activeField: null,
    state: null
  });

  const [, setEditedFieldsRecord] = useState(fieldsListRecord);
  const [, setAddedFieldsRecord] = useState(fieldsListRecord);

  const closeEditing = useCallback(() => {
    setActiveFieldEditing({
      activeField: null,
      state: null
    });
  }, []);

  const onChangeEditingStateValue = useCallback((key, value) => {
    setActiveFieldEditing(prev => ({
      activeField: prev.activeField,
      state: {
        ...prev.state,
        [key]: value
      },
    }));
  }, []);

  const saveFieldItem = useCallback(async () => {
    const { activeField, state } = activeFieldEditing;

    if (typeof state.id === 'number') {
      setEditedFieldsRecord(prev => ({
        ...prev,
        [activeField]: [...prev[activeField], { ...state }]
      }));
      await batchFetchUpdate({ [activeField]: [state] }, { method: 'PATCH' });
    } else if (typeof state.id === 'string') {
      setAddedFieldsRecord(prev => ({
        ...prev,
        [activeField]: [...prev[activeField], { ...state }]
      }));
      await batchFetchUpdate({ [activeField]: [state] }, { method: 'POST' }, false);
    }

    fetchStates[activeField].setData(prevData => {
      if (!prevData || !prevData.length) {
        return [state];
      }
      const duplicateData = prevData.find(fieldData => {
        const fieldDataCopy = { ...fieldData };
        const newDataCopy = { ...state };
        delete fieldDataCopy['id'];
        delete newDataCopy['id'];
        return deepEqual(fieldDataCopy, newDataCopy);
      });
      if (duplicateData) return prevData;
      const matchingDataIndex = prevData.findIndex(fieldData => {
        return state.id === fieldData.id
      });
      if (matchingDataIndex > -1) {
        prevData = prevData.slice();
        prevData[matchingDataIndex] = state;
        return prevData;
      }
      return [...(prevData || []), state];
    });

    closeEditing();
  }, [activeFieldEditing]);

  const addOrEditFieldItem = (field, editingId) => {
    if (!(field in fetchStates)) return;

    let formState = {
      ...defaultFieldValues[field],
      user: user.id,
      id: nanoid(4),
    };
    if (editingId) {
      formState = fetchStates[field].data?.find((fieldData) => (
        fieldData.id === editingId
      ));
    }

    setActiveFieldEditing({
      activeField: field,
      state: formState
    });
  };

  const batchFetchUpdate = useCallback(
    async (record, reqOptions, withId = true) => {
      const promises = Object.keys(record).map(async fieldKey => {
        const updatePromises = record[fieldKey].map(async item => {
          return fetchStates[fieldKey].makeRequest(
            `/${fieldKey}/${withId ? `${item.id}/` : ''}`,
            {
              body: JSON.stringify(item),
              headers: {
                'Content-Type': 'application/json'
              },
              ...reqOptions,
            },
            true
          );
        });
        return Promise.all(updatePromises);
      });
      return Promise.all(promises);
    },
    []
  );

  const removeFieldItem = useCallback(async (field, item) => {
    if (!(field in fetchStates)) return;

    fetchStates[field].setData(prev => prev && (
      prev.filter(fieldData => fieldData.id !== item.id)
    ));
    await batchFetchUpdate({ [field]: [item] }, { method: 'DELETE' });
  }, [batchFetchUpdate]);

  const filteredFetch = useCallback(async (fetch, url) => {
    let fetchedData = await fetch.makeRequest(url, undefined, true);
    if (fetchedData instanceof Array) {
      fetchedData = fetchedData.filter(data => {
        if ('user' in data) {
          return data.user === user?.id;
        }
        return true;
      });
    }
    fetch.setData(fetchedData);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    if (user) {
      Promise.all([
        filteredFetch(fetchStates.education, '/education/'),
        filteredFetch(fetchStates.work_experience, '/work_experience/'),
        filteredFetch(fetchStates.award, '/award/'),
        filteredFetch(fetchStates.skill, '/skill/'),
      ]).finally(() => setLoading(false));
    }
  }, [filteredFetch]);

  const state = {
    fetchStates,
    activeFieldEditing,
    removeFieldItem,
    addOrEditFieldItem,
    saveFieldItem,
    closeEditing,
    onChangeEditingStateValue,
    loading,
    setLoading,
  };

  return (
    <MyResumeContext.Provider value={state}>
      {children}
    </MyResumeContext.Provider>
  );
};