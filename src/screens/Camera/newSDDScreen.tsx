import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from "@react-native-community/checkbox";

const ParentChildSelection = () => {
  // Initial data array with child arrays inside
  const initialData = [
    {
      id: 1,
      name: 'Parent 1',
      children: [
        { id: '1-1', name: 'Child 1-1' },
        { id: '1-2', name: 'Child 1-2' },
      ],
    },
    {
      id: 2,
      name: 'Parent 2',
      children: [
        { id: '2-1', name: 'Child 2-1' },
        { id: '2-2', name: 'Child 2-2' },
        { id: '2-3', name: 'Child 2-3' },
      ],
    },
    {
      id: 3,
      name: 'Parent 3',
      children: [
        { id: '3-1', name: 'Child 3-1' },
      ],
    },
  ];

  const [data, setData] = useState(initialData);
  const [expanded, setExpanded] = useState({}); // Manages expanded parents
  const [selectedItems, setSelectedItems] = useState({
    parent: [],
    child: [],
  });

  // Toggle the parent list expansion
  const toggleParent = (parentId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [parentId]: !prevState[parentId],
    }));
  };

  // Handle parent checkbox selection
  const handleParentSelect = (parent) => {
    const isSelected = selectedItems.parent.includes(parent.id);

    // Toggle parent selection
    const newSelectedParents = isSelected
      ? selectedItems.parent.filter((id) => id !== parent.id)
      : [...selectedItems.parent, parent.id];

    // If parent is selected, also select all children; otherwise, deselect them
    const newSelectedChildren = isSelected
      ? selectedItems.child.filter((childId) => !parent.children.some((child) => child.id === childId))
      : [...selectedItems.child, ...parent.children.map((child) => child.id)];

    setSelectedItems({
      parent: newSelectedParents,
      child: newSelectedChildren,
    });
  };

  // Handle child checkbox selection
  const handleChildSelect = (childId, parentId) => {
    const isSelected = selectedItems.child.includes(childId);

    // Toggle child selection
    const newSelectedChildren = isSelected
      ? selectedItems.child.filter((id) => id !== childId)
      : [...selectedItems.child, childId];

    setSelectedItems((prevState) => ({
      ...prevState,
      child: newSelectedChildren,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {data.map((parent) => (
        <View key={parent.id} style={styles.parentContainer}>
          {/* Parent Checkbox and Label */}
          <TouchableOpacity
            style={styles.parentItem}
            onPress={() => toggleParent(parent.id)}
          >
            <CheckBox
              value={selectedItems.parent.includes(parent.id)}
              onValueChange={() => handleParentSelect(parent)}
            />
            <Text style={styles.parentText}>{parent.name}</Text>
          </TouchableOpacity>

          {/* Child List (shown only if the parent is expanded) */}
          {expanded[parent.id] &&
            parent.children.map((child) => (
              <View key={child.id} style={styles.childItem}>
                <CheckBox
                  value={selectedItems.child.includes(child.id)}
                  onValueChange={() => handleChildSelect(child.id, parent.id)}
                />
                <Text style={styles.childText}>{child.name}</Text>
              </View>
            ))}
        </View>
      ))}

      {/* Displaying selected items */}
      <View style={styles.selectedContainer}>
        <Text style={styles.selectedTitle}>Selected Parents:</Text>
        {selectedItems.parent.length > 0 ? (
          selectedItems.parent.map((id) => (
            <Text key={id} style={styles.selectedText}>
              Parent {id}
            </Text>
          ))
        ) : (
          <Text style={styles.selectedText}>No Parent Selected</Text>
        )}

        <Text style={styles.selectedTitle}>Selected Children:</Text>
        {selectedItems.child.length > 0 ? (
          selectedItems.child.map((id) => (
            <Text key={id} style={styles.selectedText}>
              Child {id}
            </Text>
          ))
        ) : (
          <Text style={styles.selectedText}>No Child Selected</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  parentContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
  },
  parentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  parentText: {
    fontSize: 18,
    marginLeft: 10,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingVertical: 5,
  },
  childText: {
    fontSize: 16,
  },
  selectedContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 10,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ParentChildSelection;
