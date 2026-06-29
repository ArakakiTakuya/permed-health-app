import type AppleHealthKitType from 'react-native-health';
import type {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';

type AppleHealthKitModule = typeof AppleHealthKitType;

export type AppleHealthSnapshot = {
  bloodGlucoseMgDl?: number;
  glucoseSamples: AppleHealthGlucosePoint[];
  latestHeartRateBpm?: number;
  latestHeartRateAt?: string;
  latestWeightKg?: number;
  restingHeartRateBpm?: number;
  todayStepCount?: number;
};

export type AppleHealthGlucosePoint = {
  measuredAt: string;
  valueMgDl: number;
};

export async function isAppleHealthAvailable() {
  const AppleHealthKit = await getAppleHealthKit();
  assertAppleHealthKitMethod(AppleHealthKit, 'isAvailable');

  return new Promise<boolean>((resolve, reject) => {
    AppleHealthKit.isAvailable((error, available) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(available);
    });
  });
}

export async function requestAppleHealthAccess() {
  const AppleHealthKit = await getAppleHealthKit();
  assertAppleHealthKitMethod(AppleHealthKit, 'initHealthKit');

  return new Promise<void>((resolve, reject) => {
    AppleHealthKit.initHealthKit(getAppleHealthPermissions(AppleHealthKit), (error) => {
      if (error) {
        reject(new Error(error));
        return;
      }

      resolve();
    });
  });
}

export async function getAppleHealthSnapshot(): Promise<AppleHealthSnapshot> {
  const AppleHealthKit = await getAppleHealthKit();
  const now = new Date();
  const startDate = startOfDay(now).toISOString();
  const endDate = now.toISOString();
  const glucoseStartDate = addHours(now, -24).toISOString();
  const latestSampleOptions: HealthInputOptions = {
    ascending: false,
    endDate,
    limit: 1,
    startDate,
  };

  const [
    todayStepCount,
    latestHeartRate,
    restingHeartRate,
    latestWeight,
    latestBloodGlucose,
  ] = await Promise.all([
    readOptionalValue(() =>
      getHealthValue('getStepCount', {
        date: endDate,
        includeManuallyAdded: false,
      }, AppleHealthKit),
    ),
    readOptionalSamples(() =>
      getHealthSamples('getHeartRateSamples', {
        ...latestSampleOptions,
        unit: AppleHealthKit.Constants.Units.bpm,
      }, AppleHealthKit),
    ),
    readOptionalValue(() =>
      getHealthValue('getRestingHeartRate', {
        endDate,
        startDate,
        unit: AppleHealthKit.Constants.Units.bpm,
      }, AppleHealthKit),
    ),
    readOptionalValue(() =>
      getHealthValue('getLatestWeight', {
        unit: AppleHealthKit.Constants.Units.gram,
      }, AppleHealthKit),
    ),
    readOptionalSamples(() =>
      getHealthSamples('getBloodGlucoseSamples', {
        ascending: true,
        endDate,
        limit: 96,
        startDate: glucoseStartDate,
        unit: AppleHealthKit.Constants.Units.mgPerdL,
      }, AppleHealthKit),
    ),
  ]);
  const latestHeartRateSample = latestHeartRate[0];
  const glucoseSamples = toGlucosePoints(latestBloodGlucose);
  const latestBloodGlucoseSample = glucoseSamples[glucoseSamples.length - 1];
  const displayGlucoseSamples = getDisplayGlucoseSamples(glucoseSamples, now);
  const displayBloodGlucoseSample = displayGlucoseSamples[displayGlucoseSamples.length - 1];

  return {
    bloodGlucoseMgDl: displayBloodGlucoseSample?.valueMgDl ?? latestBloodGlucoseSample?.valueMgDl,
    glucoseSamples: displayGlucoseSamples,
    latestHeartRateAt: latestHeartRateSample?.startDate,
    latestHeartRateBpm: latestHeartRateSample?.value,
    latestWeightKg:
      typeof latestWeight?.value === 'number' ? latestWeight.value / 1000 : undefined,
    restingHeartRateBpm: restingHeartRate?.value,
    todayStepCount: todayStepCount?.value,
  };
}

function toGlucosePoints(samples: HealthValue[]): AppleHealthGlucosePoint[] {
  return samples.reduce<AppleHealthGlucosePoint[]>((glucoseSamples, sample) => {
    if (typeof sample.value !== 'number' || !sample.startDate) {
      return glucoseSamples;
    }

    glucoseSamples.push({
      measuredAt: sample.startDate,
      valueMgDl: sample.value,
    });

    return glucoseSamples;
  }, []);
}

function getDisplayGlucoseSamples(samples: AppleHealthGlucosePoint[], now: Date) {
  if (samples.length > 0 || !isMockGlucoseEnabled()) {
    return samples;
  }

  return createMockGlucoseSamples(now);
}

function getHealthValue(
  method: 'getStepCount' | 'getRestingHeartRate' | 'getLatestWeight',
  options: HealthInputOptions,
  AppleHealthKit: AppleHealthKitModule,
) {
  assertAppleHealthKitMethod(AppleHealthKit, method);

  return new Promise<HealthValue>((resolve, reject) => {
    AppleHealthKit[method](options, (error, result) => {
      if (error) {
        reject(new Error(error));
        return;
      }

      resolve(result);
    });
  });
}

function getHealthSamples(
  method: 'getHeartRateSamples' | 'getBloodGlucoseSamples',
  options: HealthInputOptions,
  AppleHealthKit: AppleHealthKitModule,
) {
  assertAppleHealthKitMethod(AppleHealthKit, method);

  return new Promise<HealthValue[]>((resolve, reject) => {
    AppleHealthKit[method](options, (error, result) => {
      if (error) {
        reject(new Error(error));
        return;
      }

      resolve(result);
    });
  });
}

async function readOptionalValue(read: () => Promise<HealthValue>) {
  try {
    return await read();
  } catch {
    return undefined;
  }
}

async function readOptionalSamples(read: () => Promise<HealthValue[]>) {
  try {
    return await read();
  } catch {
    return [];
  }
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);

  return value;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function createMockGlucoseSamples(now: Date): AppleHealthGlucosePoint[] {
  const values = [
    92, 88, 94, 101, 118, 132, 146, 128, 112, 99, 91, 86,
    95, 104, 121, 137, 151, 133, 117, 108, 97, 89, 93, 102,
  ];

  return values.map((valueMgDl, index) => ({
    measuredAt: addHours(now, index - values.length + 1).toISOString(),
    valueMgDl,
  }));
}

function isMockGlucoseEnabled() {
  return process.env.EXPO_PUBLIC_USE_MOCK_GLUCOSE === '1';
}

async function getAppleHealthKit(): Promise<AppleHealthKitModule> {
  const healthModule = await import('react-native-health');

  return (healthModule.default ?? healthModule) as AppleHealthKitModule;
}

function getAppleHealthPermissions(AppleHealthKit: AppleHealthKitModule): HealthKitPermissions {
  return {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.RestingHeartRate,
        AppleHealthKit.Constants.Permissions.Weight,
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
        AppleHealthKit.Constants.Permissions.BloodGlucose,
      ],
      write: [],
    },
  };
}

function assertAppleHealthKitMethod(
  AppleHealthKit: AppleHealthKitModule,
  method: keyof AppleHealthKitModule,
) {
  if (typeof AppleHealthKit[method] !== 'function') {
    throw new Error(
      'Apple Health native module is not installed in this build. Rebuild the iOS development app with npx expo run:ios.',
    );
  }
}
