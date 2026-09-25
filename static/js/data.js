// Every number below is copied from the paper (Tables 1-2, Sections 3-5).
// Charts and the gallery read from here; nothing else hard-codes results.

export const TAXONOMY = {
  models: [
    { key: 'oft', name: 'OpenVLA-OFT' },
    { key: 'pi', name: 'π0.5' },
  ],
  // Shares of failing instructions (%). The first mode is the correctable one.
  modes: [
    { name: 'Execution misalignment', oft: 23, pi: 22, reachable: true },
    { name: 'Task misunderstanding', oft: 47, pi: 50 },
    { name: 'Perception failure', oft: 25, pi: 22 },
    { name: 'Multi-step planning', oft: 5, pi: 6 },
  ],
};

export const SIM = {
  success: [
    { name: 'In-distribution', base: [1861, 2000], ours: [1926, 2000] },
    { name: 'Out-of-distribution', base: [122, 450], ours: [155, 450] },
  ],
  // Stages share one scale so the two settings are comparable.
  funnel: [
    {
      name: 'In-distribution',
      stages: [
        { n: 139, label: 'failures' },
        { n: 65, label: 'recovered', accent: true },
      ],
    },
    {
      name: 'Out-of-distribution',
      stages: [
        { n: 328, label: 'failures' },
        { n: 64, label: 'in the 13 execution-misalignment tasks', soft: true },
        { n: 33, label: 'recovered — corrections written for 4 of those tasks', accent: true },
      ],
    },
  ],
  perTask: [
    { task: 'open the top drawer', rec: 9, of: 10 },
    { task: 'put the black bowl in the top drawer', rec: 9, of: 10 },
    { task: 'put the black bowl on the plate', rec: 5, of: 5 },
    { task: 'close the top drawer', note: 'recovered only some — it failed differently from episode to episode' },
  ],
};

export const ROBOT = {
  conditions: [
    { name: 'Environment shift only', base: [1, 9, 0], ours: [10, 10, 10] },
    { name: 'Object moved', base: [0, 10, 0], ours: [10, 10, 10] },
    { name: 'Object and location changed', base: [2, 0, 0], ours: [8, 9, 7] },
  ],
  // Runs where the object fell inside the fine-tuning distribution (paper: 9/10 or 10/10).
  inDistributionRun: (n) => n >= 9,
  engagement: { base: '0 s', ours: '40–80 s' },
};

// Two rollouts shown in the paper's Figure 3 (π0.5).
export const EXAMPLES = [
  {
    id: 'bowl',
    tab: 'Out of distribution',
    task: 'Put the black bowl in the top drawer',
    suite: 'LIBERO-90',
    sentence: 'down, more, 0.0–0.5 s',
    tuples: [['down', 'more', '0.0–0.5 s']],
    window: [0.0, 0.5],
    length: 3.1,
    note: 'Uncorrected, the policy hovers above the bowl for all 13 s.',
  },
  {
    id: 'mug',
    tab: 'In distribution',
    task: 'Put the yellow and white mug in the microwave and close it',
    suite: 'LIBERO-10',
    sentence: 'forward a little, down a little, 2.6–2.8 s',
    tuples: [['forward', 'a little', '2.6–2.8 s'], ['down', 'a little', '2.6–2.8 s']],
    window: [2.6, 2.8],
    length: 9.1,
    note: 'Uncorrected, the rollout fails at 17.3 s.',
    demo: 'pi05-mug',
  },
];

const V = './static/videos';
const OFT = './our-case';

export const DEMOS = [
  {
    key: 'pi05',
    label: 'π0.5 · Simulation',
    who: ['π0.5', 'π0.5 + one sentence'],
    aspect: '1 / 1',
    items: [
      { id: 'pi05-bowl-cabinet', group: 'In distribution', suite: 'LIBERO-Spatial', task: 'Pick up the black bowl on the wooden cabinet and place it on the plate', fail: `${V}/pi05/pi05_spatial_ep457_baseline_failure.mp4`, pass: `${V}/pi05/pi05_spatial_ep457_corrected_success.mp4` },
      { id: 'pi05-middle-drawer', group: 'In distribution', suite: 'LIBERO-Goal', task: 'Open the middle drawer of the cabinet', fail: `${V}/pi05/pi05_goal_ep13_baseline_failure.mp4`, pass: `${V}/pi05/pi05_goal_ep13_corrected_success.mp4` },
      { id: 'pi05-wine', group: 'In distribution', suite: 'LIBERO-Goal', task: 'Put the wine bottle on the rack', fail: `${V}/pi05/pi05_goal_ep477_baseline_failure.mp4`, pass: `${V}/pi05/pi05_goal_ep477_corrected_success.mp4` },
      { id: 'pi05-bowl-top', group: 'In distribution', suite: 'LIBERO-Goal', task: 'Put the bowl on top of the cabinet', fail: `${V}/pi05/pi05_goal_ep210_baseline_failure.mp4`, pass: `${V}/pi05/pi05_goal_ep210_corrected_success.mp4` },
      // Same episode as the paper's Figure 3 (bottom): durations match 17.3 s / 9.1 s.
      { id: 'pi05-mug', group: 'In distribution', suite: 'LIBERO-10', task: 'Put the yellow and white mug in the microwave and close it', fail: `${V}/pi05/pi05_10_ep455_baseline_failure.mp4`, pass: `${V}/pi05/pi05_10_ep455_corrected_success.mp4`, correction: { sentence: 'forward a little, down a little', window: [2.6, 2.8] } },
      { id: 'pi05-top-drawer', group: 'Out of distribution', suite: 'LIBERO-90', task: 'Open the top drawer of the cabinet', fail: `${V}/pi05/pi05_ood_open_drawer_ep40_baseline_failure.mp4`, pass: `${V}/pi05/pi05_ood_open_drawer_ep40_corrected_success.mp4` },
      { id: 'pi05-bowl-drawer', group: 'Out of distribution', suite: 'LIBERO-90', task: 'Put the black bowl in the top drawer of the cabinet', fail: `${V}/pi05/pi05_ood_bowl_drawer_ep11_baseline_failure.mp4`, pass: `${V}/pi05/pi05_ood_bowl_drawer_ep13_corrected_success.mp4` },
    ],
  },
  {
    key: 'oft',
    label: 'OpenVLA-OFT · Simulation',
    who: ['OpenVLA-OFT', 'OpenVLA-OFT + one sentence'],
    aspect: '1 / 1',
    items: [
      { id: 'oft-bowl-cabinet', group: 'In distribution', suite: 'LIBERO-Spatial', task: 'Pick up the black bowl on the wooden cabinet and place it on the plate', fail: `${OFT}/libero_spatial/epi462_before_2025_11_25-14_50_40--openvla_oft--episode=1--success=False--task=pick_up_the_black_bowl_on_the_wooden_cabinet_and_p.mp4`, pass: `${OFT}/libero_spatial/epi462_2025_11_25-14_52_04--openvla_oft--episode=1--success=True--task=pick_up_the_black_bowl_on_the_wooden_cabinet_and_p.mp4` },
      { id: 'oft-bbq', group: 'In distribution', suite: 'LIBERO-Object', task: 'Pick up the BBQ sauce and place it in the basket', fail: `${OFT}/libero_object/epi181_before_2025_11_26-10_05_07--openvla_oft--episode=1--success=False--task=pick_up_the_bbq_sauce_and_place_it_in_the_basket.mp4`, pass: `${OFT}/libero_object/epi181_2025_11_26-10_06_37--openvla_oft--episode=1--success=True--task=pick_up_the_bbq_sauce_and_place_it_in_the_basket.mp4` },
      { id: 'oft-tomato', group: 'In distribution', suite: 'LIBERO-Object', task: 'Pick up the tomato sauce and place it in the basket', fail: `${OFT}/libero_object/epi268_before_2025_11_26-10_12_04--openvla_oft--episode=1--success=False--task=pick_up_the_tomato_sauce_and_place_it_in_the_baske.mp4`, pass: `${OFT}/libero_object/epi268_2025_11_26-10_13_40--openvla_oft--episode=1--success=True--task=pick_up_the_tomato_sauce_and_place_it_in_the_baske.mp4` },
      { id: 'oft-middle-drawer', group: 'In distribution', suite: 'LIBERO-Goal', task: 'Open the middle drawer of the cabinet', fail: `${OFT}/libero_goal/epi39_before_2025_11_26-10_14_57--openvla_oft--episode=1--success=False--task=open_the_middle_drawer_of_the_cabinet.mp4`, pass: `${OFT}/libero_goal/epi39_2025_11_26-10_16_54--openvla_oft--episode=1--success=True--task=open_the_middle_drawer_of_the_cabinet.mp4` },
      { id: 'oft-wine', group: 'In distribution', suite: 'LIBERO-Goal', task: 'Put the wine bottle on the rack', fail: `${OFT}/libero_goal/epi459_before_2025_11_26-10_40_12--openvla_oft--episode=1--success=False--task=put_the_wine_bottle_on_the_rack.mp4`, pass: `${OFT}/libero_goal/epi459_2025_11_26-10_45_47--openvla_oft--episode=1--success=True--task=put_the_wine_bottle_on_the_rack.mp4` },
      { id: 'oft-mug', group: 'In distribution', suite: 'LIBERO-10', task: 'Put the yellow and white mug in the microwave and close it', fail: `${OFT}/libero_10/epi462_before_2025_11_26-13_25_17--openvla_oft--episode=1--success=False--task=put_the_yellow_and_white_mug_in_the_microwave_and_.mp4`, pass: `${OFT}/libero_10/epi462_2025_11_26-13_34_10--openvla_oft--episode=1--success=True--task=put_the_yellow_and_white_mug_in_the_microwave_and_.mp4` },
      { id: 'oft-moka', group: 'In distribution', suite: 'LIBERO-10', task: 'Put both moka pots on the stove', fail: `${OFT}/libero_10/epi409_before_2025_11_26-11_57_02--openvla_oft--episode=1--success=False--task=put_both_moka_pots_on_the_stove.mp4`, pass: `${OFT}/libero_10/epi409_2025_11_26-12_02_27--openvla_oft--episode=1--success=True--task=put_both_moka_pots_on_the_stove.mp4` },
    ],
  },
  {
    key: 'real',
    label: 'π0.5-DROID · Real robot',
    who: ['π0.5-DROID', 'π0.5-DROID + one sentence'],
    aspect: '4 / 5',
    items: [
      { id: 'real-shift', group: 'After moving the robot base', suite: 'Pick up the can, place it in the bowl', task: 'Environment shift only', fail: `${V}/real-robot/pi05_failure_left.mp4`, pass: `${V}/real-robot/ours_success_left.mp4` },
      { id: 'real-moved', group: 'After moving the robot base', suite: 'Pick up the can, place it in the bowl', task: 'Object moved', fail: `${V}/real-robot/pi05_failure_left2.mp4`, pass: `${V}/real-robot/ours_success_right.mp4` },
      { id: 'real-cube', group: 'After moving the robot base', suite: 'Pick up the cube, place it in the bowl', task: 'Object and location changed', fail: `${V}/real-robot/pi05_failure_cube.mp4`, pass: `${V}/real-robot/ours_success_cube.mp4` },
    ],
  },
];
