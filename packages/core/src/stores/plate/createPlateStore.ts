import { Value } from '@udecode/slate';
import { isDefined } from '@udecode/utils';
import { atom } from 'jotai';

import {
  createAtomStore,
  GetRecord,
  SetRecord,
  UseRecord,
} from '../../atoms/index';
import { useAtom } from '../../libs/index';
import { PlateEditor } from '../../types/PlateEditor';
import { PlateStoreState } from '../../types/PlateStore';

/**
 * A unique id used as a provider scope.
 * Use it if you have multiple `Plate` in the same React tree.
 * @default PLATE_SCOPE
 */
export type PlateId = string;

export const PLATE_SCOPE = 'plate';
export const GLOBAL_PLATE_SCOPE = Symbol('global-plate');

export const plateIdAtom = atom(PLATE_SCOPE);

/**
 * Get the closest `Plate` id.
 */
export const usePlateId = () => useAtom(plateIdAtom, GLOBAL_PLATE_SCOPE)[0];

export const createPlateStore = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
>({
  decorate = null,
  editor = null as any,
  id,
  isMounted = false,
  versionDecorate = 1,
  versionEditor = 1,
  versionSelection = 1,
  onChange = null,
  onSelectionChange = null,
  onValueChange = null,
  editorRef = null,
  plugins = [],
  rawPlugins = [],
  readOnly = false,
  renderElement = null,
  renderLeaf = null,
  value = null as any,
  ...state
}: Partial<PlateStoreState<V, E>> = {}) => {
  const stores = createAtomStore(
    {
      decorate,
      editor,
      id,
      isMounted,
      versionDecorate,
      versionEditor,
      versionSelection,
      onChange,
      onSelectionChange,
      onValueChange,
      editorRef,
      plugins,
      rawPlugins,
      readOnly,
      renderElement,
      renderLeaf,
      value,
      ...state,
    } as PlateStoreState<V, E>,
    {
      scope: PLATE_SCOPE,
      name: 'plate',
    }
  );

  return {
    plateStore: stores.plateStore,
    usePlateStore: (_id?: PlateId) => {
      const closestId = usePlateId();

      // get targeted store if id defined and if the store is found
      if (isDefined(_id) && stores.usePlateStore(_id).get.id(_id)) {
        return stores.usePlateStore(_id);
      }

      // if targeted store not found, get the closest store
      return stores.usePlateStore(closestId);
    },
  };
};

export const { plateStore, usePlateStore } = createPlateStore();

export const usePlateSelectors = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
>(
  id?: PlateId
): GetRecord<PlateStoreState<V, E>> => usePlateStore(id).get as any;
export const usePlateActions = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
>(
  id?: PlateId
): SetRecord<PlateStoreState<V, E>> => usePlateStore(id).set as any;
export const usePlateStates = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
>(
  id?: PlateId
): UseRecord<PlateStoreState<V, E>> => usePlateStore(id).use as any;
