# PawPlan React Native

PawPlan is a volunteer-coordination platform for animal shelters.

It is designed to help shelters coordinate dog-walking appointments while giving volunteers a simple way to book walks and interact with the shelter before, during and after an appointment.

This repository contains an initial **React Native and TypeScript prototype** exploring how selected PawPlan workflows can be implemented as a shared application for **Android and iOS**.

> **Project status:** This is an early migration prototype under active development. It is not yet a production release or a complete replacement for the existing PawPlan applications.

## Prototype goals

The initial prototype focuses on porting one complete workflow from the existing PawPlan applications:

* Browse available dogs and walking appointments
* View information about an individual dog
* Navigate between overview and detail screens
* Interact with appointment-related state
* Handle loading, empty and error states
* Provide accessible interactions on Android and iOS

The scope is intentionally limited. The objective is to establish a maintainable React Native foundation and evaluate the architectural and user-experience implications of sharing functionality across the two mobile platforms.

## Why React Native?

PawPlan currently includes separate implementations built with React/TypeScript, Kotlin/Android and Swift/SwiftUI.

The React Native prototype explores:

* Reusing existing React and TypeScript knowledge in a native mobile environment
* Sharing application and UI logic between Android and iOS
* Preserving clear boundaries between presentation, domain logic and data access
* Adapting web-oriented components and interaction patterns to native mobile conventions
* Supporting platform-specific behaviour where a shared implementation is not appropriate
* Maintaining accessibility across both mobile platforms

The intention is not to make the platforms artificially identical. Shared code should be used where it improves maintainability without compromising native behaviour or the user experience.

## Planned initial workflow

### Dog overview

Volunteers can browse dogs and available walking opportunities.

The overview is intended to demonstrate:

* Efficient list rendering
* Reusable React Native components
* Typed component properties and domain models
* Loading, empty and error states
* Accessible touch interactions

### Dog details

Volunteers can open a detail view containing relevant information about an individual dog and the available appointment options.

This part of the prototype explores:

* Cross-screen navigation
* Passing typed application data between screens
* Reusable presentation components
* Clear information hierarchy
* Screen-reader-compatible content

### Appointment interaction

A limited appointment interaction will connect the overview and detail screens to application state.

The first implementation is intended to remain deliberately small while establishing patterns that can later support booking, cancellation and appointment-status workflows.

## Technologies

The prototype is being developed with:

* **React Native**
* **TypeScript**
* **Expo**
* **Expo Router**
* **React Native StyleSheet**
* **Jest**
* **React Native Testing Library**
* **Git**

Additional technologies will only be introduced where they solve a concrete application requirement.

## Architecture

The prototype follows a separation between UI, domain models and data access.

The initial structure is organized around:

* Screen components for complete user workflows
* Reusable UI components
* Typed domain models
* Repository abstractions for data access
* Explicit loading, success, empty and error states
* Testable application logic

A simplified project structure:

```text
src/
  components/
  features/
    dogs/
    appointments/
  models/
  repositories/
```

The initial implementation can use local or mock data behind a repository interface. This allows the UI and application architecture to be developed independently before connecting the prototype to Firebase/Firestore.

## Accessibility

Accessibility is part of the prototype from the beginning rather than a later addition.

The project considers:

* Meaningful accessibility labels, roles and hints
* Logical screen-reader navigation
* Accessible headings and content structure
* Descriptive image alternatives
* Sufficient touch-target sizes
* Announcements for relevant dynamic state changes
* Testing with VoiceOver on iOS and TalkBack on Android
* Platform-specific accessibility behaviour where necessary

This work builds on the accessibility improvements made to the PawPlan React web application, including semantic structure, keyboard navigation, accessible form handling and screen-reader support.

## Testing

The prototype uses **Jest** and **React Native Testing Library** for component and interaction testing.

The initial test coverage is intended to include:

* Rendering repository results
* Displaying loading, empty and error states
* Navigating from an overview item to its detail screen
* Triggering an appointment-related interaction
* Querying important controls through their accessible roles and labels

End-to-end testing and store-distribution workflows are outside the scope of the initial prototype.

## Running the project

Install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using:

* An Android emulator
* An iOS simulator
* A physical device with Expo Go

## Broader PawPlan platform

PawPlan is being developed as a multi-platform product rather than as several identical applications. Each existing implementation currently has a different focus.

### React web application

The React and TypeScript web application focuses primarily on shelter-management functionality:

* User and role management
* Dog management
* Appointment management
* Accessible browser-based workflows

### Native Android application

The Kotlin application focuses on the volunteer experience before and during a walk:

* Appointment booking
* Route tracking using location services
* Incident reporting
* Appointment-related notifications
* Background and lifecycle-aware functionality

### iOS prototype

The Swift and SwiftUI application was the first mobile implementation and serves as an initial prototype of PawPlan’s core appointment workflows.

### React Native prototype

This repository evaluates which parts of the mobile experience can be implemented effectively through a shared React Native and TypeScript codebase while preserving appropriate native behaviour.

## Motivation

PawPlan originated from my own experience as an animal-shelter volunteer.

Finding time to volunteer can already be difficult, and coordinating available volunteers, dogs and suitable walking times adds further friction. PawPlan explores how software can simplify that coordination and make it easier for volunteers to turn their intention to help into action.

The project has since grown into an opportunity to explore user-centred, accessible web and mobile development across multiple platforms while working on a product based on a real-world need.

## Current limitations

This repository represents a focused technical prototype.

It does not currently claim:

* Feature parity with the native Android application
* Complete Firebase/Firestore integration
* Production-ready authentication
* Background location tracking
* Push-notification support
* App Store or Google Play distribution
* Production-scale React Native experience

These areas may be evaluated incrementally after the initial cross-platform workflow and architecture have been validated.
