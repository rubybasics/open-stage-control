# Sending / Receiving MIDI

Open Stage Control can send and receive midi messages using pyo / portmidi.

## Requirements

MIDI support requires additionnal softwares to be installed on the server's system:

- `python 2.7`
- [`pyo`](http://ajaxsoundstudio.com/software/pyo/) >= 0.8.3

**Why an additionnal dependency ?**

Providing cross-platform midi support is not trivial, as it requires os-specific compilations that cannot be automated within Open Stage Control's current packaging workflow. Using a python addon seems the best compromise so far : the core app remains easy to build, and the extra dependency is easy to install.

Note: `pyo` doesn't support Windows 64bit.

## Setup

When running the app, the `-m / -midi` switch must be set; it accepts the following arguments (separated by spaces):

- `list`: prints the available midi inputs / outputs
- `device_name:input,output`, where:
    - `device_name`
    - `input` is the midi input number (midi message sent to open-stage-control)
    - `output` is the midi output number (midi message sent from open-stage-control)

**Linux only**

- `device_name:virtual`: (requires [`mididings`](http://das.nasophon.de/mididings/) to be installed) creates a virtual midi device called 'Open Stage Control' with the following ports :
    - `_virtual_loopback_x`: used internally, don't connect anything to it.
    - `device_name_in`: virtual midi input
    - `device_name_out`: virtual midi output

Multiple devices can be declared (multiple virtual devices as well).

## Widget settings

In order to send midi messages, a widget must have at least one `target` formatted as follow;  

`midi:device_name` (where `device_name` is one of the declared midi devices (see previous section))

## Supported commands

Here are the supported commands. One must use the `preArgs` option to make sure the correct number of arguments is sent.

| address | args | note |
|---------|------|------|
| `/note` | `channel note velocity` |  (if `velocity` is `0`, a `note off` will be sent) |
| `/control` | `channel cc   value` |  |
| `/program` | `channel program` |  |
| `/pitch` | `channel LSB MSB` |  |


- `channel` is an integer between 1 and 16
- `ǹote`, `velocity`, `cc`, `value`, `program`, `LSB`,`MSB` are integers between 0 and 127
