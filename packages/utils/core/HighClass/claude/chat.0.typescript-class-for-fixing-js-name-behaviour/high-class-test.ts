import { describe, it, expect } from 'vitest';
import { fix } from './high-class-fixes';

describe('Class Fixes', () => {
  describe('Name Fix', () => {
    const NamedClass = fix('name')(class {
      constructor(public instanceName?: string) {}
    });

    it('should preserve instance name', () => {
      const instance = new NamedClass('Alice');
      expect(instance.name).toBe('Alice');
    });

    it('should not allow name modification', () => {
      const instance = new NamedClass('Bob');
      
      // @ts-expect-error Testing non-writable property
      instance.name = 'Charlie';
      
      expect(instance.name).toBe('Bob');
    });
  });

  describe('Binding Fix', () => {
    class Counter {
      count = 0;
      
      increment() {
        this.count++;
      }
    }

    it('should maintain context when method is passed', () => {
      const BoundCounter = fix('binding')(Counter);
      const counter = new BoundCounter();
      
      const increment = counter.increment;
      increment(); // Should not throw
      
      expect(counter.count).toBe(1);
    });
  });

  describe('Combined Fixes', () => {
    const CombinedClass = fix('name', 'binding')(class {
      constructor(public data: string) {}
      
      getData() {
        return this.data;
      }
    });

    it('should apply multiple fixes', () => {
      const instance = new CombinedClass('test');
      
      expect(instance.name).toBe('test');
      
      const getData = instance.getData;
      expect(getData()).toBe('test');
    });
  });
});
